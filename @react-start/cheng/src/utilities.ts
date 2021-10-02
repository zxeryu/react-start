import { arrayMove } from "@dnd-kit/sortable";
import { get, size, findIndex } from "lodash";

import type { FlattenedItem, IOperateElementItem, TreeItem, TreeItems } from "./types";

const getDragDepth = (offset: number, indentationWidth: number) => {
  return Math.round(offset / indentationWidth);
};

const getMaxDepth = ({ previousItem }: { previousItem: FlattenedItem }) => {
  if (previousItem) {
    if (previousItem.isContainer) {
      return previousItem.depth + 1;
    }
    return previousItem.depth;
  }

  return 0;
};

const getMinDepth = ({ nextItem }: { nextItem: FlattenedItem }) => {
  if (nextItem) {
    return nextItem.depth;
  }

  return 0;
};

export type ProjectionType = {
  depth: number;
  maxDepth: number;
  minDepth: number;
  parentId: string | null;
};

export const getProjection = (
  items: FlattenedItem[],
  activeId: string,
  overId: string,
  dragOffset: number,
  indentationWidth: number,
): ProjectionType => {
  const overItemIndex = items.findIndex(({ oid }) => oid === overId);
  const activeItemIndex = items.findIndex(({ oid }) => oid === activeId);
  const activeItem = items[activeItemIndex];
  const newItems = arrayMove(items, activeItemIndex, overItemIndex);
  const previousItem = newItems[overItemIndex - 1];
  const nextItem = newItems[overItemIndex + 1];
  const dragDepth = getDragDepth(dragOffset, indentationWidth);
  const projectedDepth = activeItem.depth + dragDepth;
  const maxDepth = getMaxDepth({
    previousItem,
  });
  const minDepth = getMinDepth({ nextItem });
  let depth = projectedDepth;

  if (projectedDepth >= maxDepth) {
    depth = maxDepth;
  } else if (projectedDepth < minDepth) {
    depth = minDepth;
  }

  const getParentId = () => {
    if (depth === 0 || !previousItem) {
      return null;
    }

    if (depth === previousItem.depth) {
      return previousItem.parentId;
    }

    if (depth > previousItem.depth) {
      return previousItem.oid;
    }

    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find((item) => item.depth === depth)?.parentId;

    return newParent ?? null;
  };

  return { depth, maxDepth, minDepth, parentId: getParentId() };
};

const flatten = (items: TreeItems, parentId: string | null = null, depth = 0): FlattenedItem[] => {
  return items.reduce<FlattenedItem[]>((acc, item, index) => {
    const elementList = get(item, "elementList", []);
    return [...acc, { ...item, parentId, depth, index }, ...flatten(elementList, item.oid, depth + 1)];
  }, []);
};

export const flattenTree = (items: TreeItems): FlattenedItem[] => {
  return flatten(items);
};

export const findItem = (items: TreeItem[], itemId: string) => {
  return items.find(({ oid }) => oid === itemId);
};

export const buildTree = (flattenedItems: FlattenedItem[]): TreeItems => {
  const root: TreeItem = { oid: "root", id: "root", elementList: [] };
  const nodes: Record<string, TreeItem> = { [root.oid]: root };
  const items = flattenedItems.map((item) => ({ ...item, elementList: [] }));

  for (const item of items) {
    const { oid, id, elementList } = item;
    const parentId = item.parentId ?? root.oid;
    const parent = nodes[parentId] ?? findItem(items, parentId);

    nodes[oid] = { oid, id, elementList };
    parent.elementList?.push(item);
  }

  return root.elementList!;
};

export const findItemDeep = (items: TreeItems, itemId: string): TreeItem | undefined => {
  for (const item of items) {
    const { oid, elementList } = item;

    if (oid === itemId) {
      return item;
    }

    if (size(elementList) > 0) {
      const child = findItemDeep(elementList!, itemId);

      if (child) {
        return child;
      }
    }
  }

  return undefined;
};

export const removeItem = (items: TreeItems, oid: string) => {
  const newItems = [];

  for (const item of items) {
    if (item.oid === oid) {
      continue;
    }

    if (size(item.elementList) > 0) {
      item.elementList = removeItem(item.elementList!, oid);
    }

    newItems.push(item);
  }

  return newItems;
};

export const setProperty = <T extends keyof TreeItem>(
  items: TreeItems,
  oid: string,
  property: T,
  setter: (value: TreeItem[T]) => TreeItem[T],
) => {
  for (const item of items) {
    if (item.oid === oid) {
      item[property] = setter(item[property]);
      continue;
    }

    if (size(item.elementList) > 0) {
      item.elementList = setProperty(item.elementList!, oid, property, setter);
    }
  }

  return [...items];
};

const countChildren = (items: TreeItem[], count = 0): number => {
  return items.reduce((acc, { elementList }) => {
    if (size(elementList) > 0) {
      return countChildren(elementList!, acc + 1);
    }

    return acc + 1;
  }, count);
};

export const getChildCount = (items: TreeItems, oid: string) => {
  if (!oid) {
    return 0;
  }

  const item = findItemDeep(items, oid);

  return item ? countChildren(get(item, "elementList", [])) : 0;
};

export const removeChildrenOf = (items: FlattenedItem[], ids: string[]) => {
  const excludeParentIds = [...ids];

  return items.filter((item) => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      if (size(item.elementList) > 0) {
        excludeParentIds.push(item.oid);
      }
      return false;
    }

    return true;
  });
};

export const findTarget = (
  items: IOperateElementItem[],
  oid: string,
  cb: (arr: IOperateElementItem[], index: number) => void,
) => {
  const index = findIndex(items, (el) => el.oid === oid);
  if (index > -1) {
    cb(items, index);
    return;
  }
  const len = size(items);
  for (let i = 0; i < len; i++) {
    const els = items[i]?.elementList;
    if (els && size(els) > 0) {
      findTarget(els, oid, cb);
    }
  }
};
