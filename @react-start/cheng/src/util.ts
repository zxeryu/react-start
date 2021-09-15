import { SyntheticEvent } from "react";

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
