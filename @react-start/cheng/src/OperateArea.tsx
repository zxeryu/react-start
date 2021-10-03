import { Button, Stack } from "@material-ui/core";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { OperatorContextProps, OperatorProps, useOperator } from "./Operator";
import { FlattenedItem, IElementItem, IOperateElementItem } from "./types";
import {
  closestCenter,
  defaultDropAnimation,
  DndContext,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  LayoutMeasuring,
  LayoutMeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import {
  buildTree,
  findTarget,
  flattenTree,
  getProjection,
  ProjectionType,
  removeChildrenOf,
  removeItem,
  setProperty,
} from "./utilities";
import { reduce, size, map, find, findIndex, get, isArray } from "lodash";
import { SortableTreeItem, TreeItem } from "./OperateAreaItem";
import { createPortal } from "react-dom";
import { ElementsDialog } from "./ElementsPanel";
import { generateId } from "./util";

const layoutMeasuring: Partial<LayoutMeasuring> = {
  strategy: LayoutMeasuringStrategy.Always,
};

const dropAnimation: DropAnimation = {
  ...defaultDropAnimation,
  dragSourceOpacity: 0.5,
};

const indentationWidth = 50;

//菜单名称key
export const OPERATE_CONFIG_NAME = "operate_config_name$";

export const getOelName = (oel: IOperateElementItem) => {
  return get(oel, ["props", OPERATE_CONFIG_NAME]) || get(oel, "name");
};

export const OperateContent = ({
  data,
  setData,
  setDataWithEmitChange,
  onItemClick,
  isShowAddTrigger,
}: Pick<OperatorContextProps, "data" | "setData" | "setDataWithEmitChange"> &
  Pick<OperatorProps, "onItemClick"> & {
    isShowAddTrigger?: boolean;
  }) => {
  const dataRef = useRef<IOperateElementItem[]>(data);
  dataRef.current = data;

  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const [offsetLeft, setOffsetLeft] = useState(0);

  const resetState = useCallback(() => {
    setOverId(null);
    setActiveId(null);
    setOffsetLeft(0);
  }, []);

  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(data);
    const collapsedItems = reduce<FlattenedItem, string[]>(
      flattenedTree,
      (acc, item) => {
        if (item.collapsed && size(item.elementList) > 0) {
          return [...acc, item.oid];
        }
        return acc;
      },
      [],
    );
    return removeChildrenOf(flattenedTree, activeId ? [activeId, ...collapsedItems] : collapsedItems);
  }, [activeId, data]);

  const projected =
    activeId && overId ? getProjection(flattenedItems, activeId, overId, offsetLeft, indentationWidth) : null;
  const projectedRef = useRef<ProjectionType | null>(projected);
  projectedRef.current = projected;

  const sortedIds = useMemo(() => map<FlattenedItem, string>(flattenedItems, ({ oid }) => oid), [flattenedItems]);
  const activeItem = activeId ? find(flattenedItems, ({ oid }) => oid === activeId) : null;

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = useCallback(({ active: { id: activeId } }: DragStartEvent) => {
    setActiveId(activeId);
    setOverId(activeId);
  }, []);

  const handleDragMove = useCallback(({ delta }: DragMoveEvent) => {
    setOffsetLeft(delta.x);
  }, []);

  const handleDragOver = useCallback(({ over }: DragOverEvent) => {
    setOverId(over?.id ?? null);
  }, []);

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    resetState();

    if (projected && over) {
      const { depth, parentId } = projected;

      const clonedItems: FlattenedItem[] = flattenTree(dataRef.current);
      const overIndex = findIndex(clonedItems, ({ oid }) => oid === over.id);
      const activeIndex = findIndex(clonedItems, ({ oid }) => oid === active.id);
      const activeTreeItem = clonedItems[activeIndex];

      clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId };

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
      const newItems = buildTree(sortedItems);
      setDataWithEmitChange(newItems);
    }
  };

  const handleDragCancel = useCallback(() => resetState(), []);

  /***************** 展开、关闭 **********************/

  const handleCollapse = useCallback((oid: string) => {
    setData((prev) =>
      setProperty(prev, oid, "collapsed", (value) => {
        return !value;
      }),
    );
  }, []);

  /***************** 删除 **********************/

  const handleRemove = useCallback((oid: string) => {
    setDataWithEmitChange((prev) => removeItem(prev, oid));
  }, []);

  /***************** 修改名称 **********************/

  const handleNameChange = useCallback((oid: string, name: string) => {
    setDataWithEmitChange((prev) => {
      const nextData = [...prev];
      findTarget(nextData, oid, (arr, index) => {
        const item = arr[index];
        arr[index] = { ...item, props: { ...item.props, [OPERATE_CONFIG_NAME]: name } };
      });
      return nextData;
    });
  }, []);

  /***************** 添加元素 **********************/

  const [open, setOpen] = useState<boolean>(false);
  const addOelIDRef = useRef<string>();
  const handleAddChild = useCallback((oid: string) => {
    addOelIDRef.current = oid;
    setOpen(true);
  }, []);

  const handleAddSuccess = useCallback((el: IElementItem) => {
    const addOEL: IOperateElementItem = { ...el, oid: generateId() };
    //指定元素添加
    if (addOelIDRef.current) {
      setDataWithEmitChange((prev) => {
        const nextData = [...prev];
        findTarget(nextData, addOelIDRef.current!, (arr, index) => {
          const item = arr[index];
          if (isArray(item.elementList)) {
            item.elementList = [...item.elementList, addOEL];
          } else {
            item.elementList = [addOEL];
          }
        });
        return nextData;
      });
    } else {
      setDataWithEmitChange([...dataRef.current, addOEL]);
    }
    setOpen(false);
    addOelIDRef.current = "";
  }, []);

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        layoutMeasuring={layoutMeasuring}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}>
        <SortableContext items={sortedIds} strategy={verticalListSortingStrategy}>
          <Stack className={"OperateArea"} style={{ flex: 1 }}>
            {map(flattenedItems, (oel: FlattenedItem) => {
              const { oid, depth, name, collapsed, elementList, isContainer, canDelete, canDrag, canEditName, props } =
                oel;
              return (
                <SortableTreeItem
                  key={oid}
                  id={oid}
                  depth={oid === activeId && projected ? projected.depth : depth}
                  indentationWidth={indentationWidth}
                  label={get(props, OPERATE_CONFIG_NAME, name)}
                  canDrag={canDrag}
                  collapsed={isContainer && collapsed && size(elementList) > 0}
                  onCollapse={isContainer && size(elementList) > 0 ? handleCollapse : undefined}
                  onRemove={canDelete ? handleRemove : undefined}
                  onNameChange={canEditName ? handleNameChange : undefined}
                  onAddChild={isContainer ? handleAddChild : undefined}
                  onClick={() => onItemClick && onItemClick(oel)}
                />
              );
            })}
          </Stack>
          {createPortal(
            <DragOverlay dropAnimation={dropAnimation}>
              {activeId && activeItem ? (
                <TreeItem
                  id={activeId}
                  clone
                  depth={activeItem.depth}
                  indentationWidth={indentationWidth}
                  label={activeItem.name}
                />
              ) : null}
            </DragOverlay>,
            document.body,
          )}
        </SortableContext>
      </DndContext>
      {isShowAddTrigger && (
        <Button fullWidth onClick={() => setOpen(true)}>
          添加元素
        </Button>
      )}
      {open && (
        <ElementsDialog
          onClose={() => {
            setOpen(false);
            addOelIDRef.current = "";
          }}
          onSuccess={handleAddSuccess}
        />
      )}
    </>
  );
};

export const OperateArea = ({ onItemClick }: Pick<OperatorProps, "onItemClick">) => {
  const { data, setData, setDataWithEmitChange } = useOperator();

  return (
    <OperateContent
      data={data}
      setData={setData}
      setDataWithEmitChange={setDataWithEmitChange}
      onItemClick={onItemClick}
    />
  );
};
