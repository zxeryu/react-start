import { SyntheticEvent } from "react";
import { NamePath } from "./types";
import { head, isArray, isString } from "lodash";

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

export const getFirstPropNameFromNamePath = (targetName: NamePath) => {
  let firstPath: string | number | undefined;
  if (isArray(targetName)) {
    firstPath = head(targetName);
  } else if (isString(targetName) && targetName.indexOf(".") > 0) {
    firstPath = targetName.substring(0, targetName.indexOf("."));
  } else {
    firstPath = targetName;
  }
  return firstPath;
};
