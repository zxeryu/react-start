import { SyntheticEvent } from "react";
import { IOption, NamePath } from "./types";
import { get, head, isArray, isString, keys, map, reduce } from "lodash";

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

export const listToOptions = (list: any[], fieldNames?: { label: string; value: string }) => {
  return map(list, (item) => {
    const label = get(item, fieldNames?.label || "label");
    const value = get(item, fieldNames?.value || "value");
    return { label, value };
  });
};

export const listToEnum = (list: any[], fieldNames?: { label: string; value: string }) => {
  return reduce(
    list,
    (pair, item) => {
      const label = get(item, fieldNames?.label || "label");
      const value = get(item, fieldNames?.value || "value");
      return {
        ...pair,
        [value]: label,
      };
    },
    {},
  );
};

export const listToCompose = (list: any[], fieldNames?: { label: string; value: string }) => {
  return {
    options: listToOptions(list, fieldNames),
    valueEnum: listToEnum(list, fieldNames),
  };
};

export const optionsToEnum = (options: IOption[]) => {
  return reduce(options, (pair, item) => ({ ...pair, [item.value]: item.label }), {});
};

export const enumToOptions = (em: Record<string, any>) => {
  return map(keys(em), (key) => ({ label: key, value: em[key] }));
};
