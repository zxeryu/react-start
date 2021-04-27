import { IOperateElementItem } from "./types";
import { findIndex, filter } from "lodash";

export const generateId = () => {
  return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
};

export const addItem = (arr: IOperateElementItem[], el: IOperateElementItem, locOID?: string) => {
  const oArr = [...arr];
  if (locOID) {
    const index = findIndex(oArr, (el) => el.oid === locOID);
    if (index > -1) {
      oArr.splice(index, 0, el);
      return oArr;
    }
  }
  return [...oArr, el];
};

export const removeItem = (arr: IOperateElementItem[], oid: string) => {
  return filter(arr, (item) => item.oid !== oid);
};

export const moveItem = (arr: IOperateElementItem[], index: number, toIndex: number) => {
  const oArr = [...arr];
  const [target] = oArr.splice(index, 1);
  oArr.splice(toIndex, 0, target);
  return oArr;
};

export const moveItemById = (arr: IOperateElementItem[], oid: string, toOID: string) => {
  const index = findIndex(arr, (item) => item.oid === oid);
  const toIndex = findIndex(arr, (item) => item.oid === toOID);
  if (index > -1 && toIndex > -1) {
    return moveItem(arr, index, toIndex);
  }
  return arr;
};
