import { Stack } from "@material-ui/core";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useOperator } from "./Operator";
import { FlattenedItem, IOperateElementItem } from "./types";
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
  flattenTree,
  getProjection,
  ProjectionType,
  removeChildrenOf,
  removeItem,
  setProperty,
} from "./utilities";
import { reduce, size, map, find, findIndex } from "lodash";
import { SortableTreeItem, TreeItem } from "./OperateAreaItem";
import { createPortal } from "react-dom";

const layoutMeasuring: Partial<LayoutMeasuring> = {
  strategy: LayoutMeasuringStrategy.Always,
};

const dropAnimation: DropAnimation = {
  ...defaultDropAnimation,
  dragSourceOpacity: 0.5,
};

const indentationWidth = 50;

export const OperateArea = ({ onItemClick }: { onItemClick: (oel: IOperateElementItem) => void }) => {
  const { data, setData, setDataWithEmitChange } = useOperator();
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

  const handleCollapse = useCallback((oid: string) => {
    setData((prev) =>
      setProperty(prev, oid, "collapsed", (value) => {
        return !value;
      }),
    );
  }, []);

  const handleRemove = useCallback((oid: string) => {
    setDataWithEmitChange((prev) => removeItem(prev, oid));
  }, []);

  return (
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
            const { oid, depth, name, collapsed, elementList, isContainer, canDelete, canDrag } = oel;
            return (
              <SortableTreeItem
                key={oid}
                id={oid}
                depth={oid === activeId && projected ? projected.depth : depth}
                indentationWidth={indentationWidth}
                label={name}
                canDrag={canDrag}
                collapsed={isContainer && collapsed && size(elementList) > 0}
                onCollapse={isContainer && size(elementList) > 0 ? handleCollapse : undefined}
                onRemove={canDelete ? handleRemove : undefined}
                onClick={() => onItemClick(oel)}
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
  );
};
