import { SyntheticEvent } from "react";
import { ElementConfigBase } from "@react-start/cheng-high";
import { findIndex, forEach, isArray, size, get } from "lodash";
import { MenuClickEventHandler } from "rc-menu/lib/interface";

export const generateId = () => {
  return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
};

type IEvent = SyntheticEvent<any>;

export const withPreventDefault = (callback: (e: IEvent) => void) => (e: IEvent) => {
  if (e) {
    e.preventDefault();
  }
  callback(e);
};

export const withoutBubble = (callback: (e: IEvent) => void) => (e: IEvent) => {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  callback(e);
};

export const withoutMenuItemBubble = (cb: () => void): MenuClickEventHandler => {
  return (e) => {
    e.domEvent.preventDefault();
    e.domEvent.stopPropagation();
    cb();
  };
};

export const isElementConfig = (obj: Object) => {
  if (!obj) {
    return false;
  }
  return !!get(obj, "elementType$");
};

export const isGroupSetting = (config: any) => {
  return !!get(config, "groupType");
};

export const findTarget = (
  list: ElementConfigBase[],
  oid: string,
  cb: (list: ElementConfigBase[], index: number) => void,
) => {
  const index = findIndex(list, (item) => {
    return item.oid === oid;
  });
  if (index > -1) {
    cb(list, index);
    return;
  }
  forEach(list, (item) => {
    if (size(item.elementList) > 0) {
      findTarget(item.elementList!, oid, cb);
    }
  });
};

export const addElement = (list: ElementConfigBase[], element: ElementConfigBase, parentOid?: string) => {
  const nextList = [...list];
  if (!parentOid) {
    nextList.push(element);
    return nextList;
  }
  findTarget(nextList, parentOid, (arr, index) => {
    const target = arr[index];
    if (isArray(target.elementList)) {
      target.elementList.push(element);
    } else {
      target.elementList = [element];
    }
  });
  return nextList;
};

export const removeElement = (list: ElementConfigBase[], oid: string) => {
  const nextList = [...list];
  findTarget(nextList, oid, (arr, index) => {
    arr.splice(index, 1);
  });
  return nextList;
};

export const updateElement = (list: ElementConfigBase[], element: ElementConfigBase) => {
  const nextList = [...list];
  findTarget(nextList, element.oid, (arr, index) => {
    arr[index] = element;
  });
  return nextList;
};
