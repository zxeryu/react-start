import { IOperateElementItem } from "./types";
import { findIndex, size, isArray } from "lodash";
import { SyntheticEvent } from "react";

export const generateId = () => {
  return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
};

type TCallback = (arr: IOperateElementItem[], index: number) => void;

const deepOpe = (arr: IOperateElementItem[], oid: string, cb: TCallback) => {
  const index = findIndex(arr, (el) => el.oid === oid);
  if (index > -1) {
    cb(arr, index);
    return;
  }
  const len = size(arr);
  for (let i = 0; i < len; i++) {
    const els = arr[i]?.elementList;
    if (els && size(els) > 0) {
      deepOpe(els, oid, cb);
    }
  }
};

export const addItem = (arr: IOperateElementItem[], el: IOperateElementItem, locOID?: string, targetOID?: string) => {
  const oArr = [...arr];
  //添加导末尾
  if (!locOID) {
    if (!targetOID) {
      //添加到根
      return [...arr, el];
    } else {
      //添加到指定target
      deepOpe(oArr, targetOID, (opeArr, index) => {
        if (isArray(opeArr[index].elementList)) {
          opeArr[index].elementList!.push(el);
        } else {
          opeArr[index].elementList = [el];
        }
      });
      return oArr;
    }
  }
  deepOpe(oArr, locOID, (opeArr, index) => {
    opeArr.splice(index, 0, el);
  });
  return oArr;
};

export const removeItem = (arr: IOperateElementItem[], oid: string) => {
  const oArr = [...arr];
  deepOpe(oArr, oid, (opeArr, index) => {
    opeArr.splice(index, 1);
  });
  return oArr;
};

export const moveItem = (arr: IOperateElementItem[], index: number, toIndex: number) => {
  const oArr = [...arr];
  const [target] = oArr.splice(index, 1);
  oArr.splice(toIndex, 0, target);
  return oArr;
};

export const moveItemById = (arr: IOperateElementItem[], oid: string, toOID: string, addToTarget?: boolean) => {
  const oArr = [...arr];
  let tOpeArr: IOperateElementItem[] | undefined;
  let tIndex = -1;

  deepOpe(oArr, oid, (opeArr, index) => {
    tOpeArr = opeArr;
    tIndex = index;
  });
  if (!tOpeArr || tIndex === -1) {
    return oArr;
  }
  deepOpe(oArr, toOID, (opeArr, index) => {
    const [target] = tOpeArr!.splice(tIndex, 1);
    if (addToTarget) {
      if (isArray(opeArr[index].elementList)) {
        opeArr[index].elementList!.push(target);
      } else {
        opeArr[index].elementList = [target];
      }
    } else {
      opeArr.splice(index, 0, target);
    }
  });
  return oArr;
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
