import React, { CSSProperties, forwardRef, ReactNode, useMemo, useState } from "react";
import { DragHandle, ArrowForwardIos as Arrow, MoreVert } from "@material-ui/icons";
import { Stack, Typography, IconButton, Menu, MenuItem, TextField } from "@material-ui/core";
import { AnimateLayoutChanges, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { get } from "lodash";
import { withoutBubble } from "./util";

const countStyle: CSSProperties = {
  position: "absolute",
  top: -10,
  right: -10,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 24,
  height: 24,
  borderRadius: "50%",
  backgroundColor: "#2389ff",
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "#fff",
};

export interface TreeItemProps {
  id: string;
  depth: number;
  indentationWidth: number;
  childCount?: number;
  clone?: boolean;
  collapsed?: boolean;
  disableInteraction?: boolean;
  disableSelection?: boolean;
  ghost?: boolean;
  handleProps?: any;
  label: ReactNode;
  style?: CSSProperties;
  onCollapse?: (oid: string) => void;
  onRemove?: (oid: string) => void;
  onNameChange?: (oid: string, name: string) => void;
  wrapperRef?: (node: HTMLElement) => void;
  onClick?: () => void;
  canDrag?: boolean;
}

const OperateMenu = ({
  clone,
  onRemove,
  onNameChange,
  id,
  onNameEditClick,
}: Pick<TreeItemProps, "clone" | "onRemove" | "onNameChange" | "id"> & {
  onNameEditClick: () => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const showMenu = useMemo(() => {
    return !clone && (onRemove || onNameChange);
  }, [clone, onRemove, onNameChange]);

  return (
    <>
      {showMenu && (
        <IconButton
          size={"small"}
          onClick={withoutBubble((e) => {
            setAnchorEl(e.currentTarget);
          })}>
          <MoreVert />
        </IconButton>
      )}
      <Menu open={!!anchorEl} anchorEl={anchorEl} onClose={withoutBubble(() => setAnchorEl(null))}>
        {onRemove && (
          <MenuItem
            value={"delete"}
            onClick={withoutBubble(() => {
              setAnchorEl(null);
              onRemove(id);
            })}>
            删除
          </MenuItem>
        )}
        {onNameChange && (
          <MenuItem
            value={"editName"}
            onClick={withoutBubble(() => {
              setAnchorEl(null);
              onNameEditClick();
            })}>
            修改名称
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export const TreeItem = forwardRef<HTMLDivElement, TreeItemProps>(
  (
    {
      id,
      childCount,
      canDrag,
      clone,
      depth,
      disableSelection,
      disableInteraction,
      ghost,
      handleProps,
      indentationWidth,
      collapsed,
      onCollapse,
      onRemove,
      onNameChange,
      style,
      label,
      wrapperRef,
      ...otherProps
    }: TreeItemProps,
    ref,
  ) => {
    const { wrapperStyle, itemStyle, disableStyle }: { [key: string]: CSSProperties } = useMemo(
      () => ({
        wrapperStyle: {
          ...(clone ? { display: "inline-block", pointerEvents: "none", padding: 5 } : undefined),
          ...(disableInteraction ? { pointerEvents: "none" } : undefined),
        },
        itemStyle: {
          ...(clone
            ? {
                padding: 5,
                paddingRight: 24,
                borderRadius: 4,
                boxShadow: "0px 15px 15px 0 rgba(34, 33, 81, 0.1)",
              }
            : undefined),
        },
        disableStyle: {
          ...(clone || disableSelection ? { userSelect: "none", WebkitUserSelect: "none" } : undefined),
        },
      }),
      [clone, disableInteraction, disableSelection],
    );

    //编辑名称

    const [editName, setEditName] = useState<boolean>(false);

    return (
      <li
        ref={wrapperRef as any}
        style={{
          paddingLeft: `${indentationWidth * depth}px`,
          listStyle: "none",
          boxSizing: "border-box",
          marginBottom: -1,
          ...wrapperStyle,
        }}
        {...otherProps}>
        <Stack
          ref={ref}
          direction={"row"}
          style={{
            alignItems: "center",
            border: "1px solid #dedede",
            boxSizing: "border-box",
            backgroundColor: "white",
            cursor: "pointer",
            ...style,
            ...itemStyle,
            padding: 10,
          }}>
          {canDrag ? (
            <DragHandle style={{ outline: "none", cursor: "grab", color: "#666" }} {...handleProps} />
          ) : (
            <DragHandle style={{ visibility: "hidden" }} />
          )}
          {onCollapse && <Arrow onClick={() => onCollapse(id)} />}
          {editName ? (
            <TextField
              size={"small"}
              defaultValue={label}
              onKeyDown={(e) => {
                if (e.code === "Enter") {
                  onNameChange && onNameChange(id, get(e.target, "value"));
                  setEditName(false);
                }
              }}
              onBlur={(e) => {
                onNameChange && onNameChange(id, get(e.target, "value"));
                setEditName(false);
              }}
            />
          ) : (
            <Typography variant={"subtitle2"} noWrap style={{ paddingLeft: ".5rem", flexGrow: 1, ...disableStyle }}>
              {label}
            </Typography>
          )}

          <OperateMenu
            id={id}
            clone={clone}
            onRemove={onRemove}
            onNameChange={onNameChange}
            onNameEditClick={() => setEditName(true)}
          />

          {clone && childCount && <span style={{ ...countStyle, ...disableStyle }}>{childCount}</span>}
        </Stack>
      </li>
    );
  },
);

const animateLayoutChanges: AnimateLayoutChanges = ({ isSorting, wasSorting }) =>
  isSorting || wasSorting ? false : true;

export const SortableTreeItem = ({ id, style, ...otherProps }: TreeItemProps) => {
  const {
    attributes,
    isDragging,
    isSorting,
    listeners,
    setDraggableNodeRef,
    setDroppableNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
    animateLayoutChanges,
  });
  return (
    <TreeItem
      ref={setDraggableNodeRef}
      wrapperRef={setDroppableNodeRef}
      style={{ ...style, transform: CSS.Translate.toString(transform), transition: transition as any }}
      ghost={isDragging}
      disableSelection={false}
      disableInteraction={isSorting}
      handleProps={{
        ...attributes,
        ...listeners,
      }}
      id={id}
      {...otherProps}
    />
  );
};
