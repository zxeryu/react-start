import { HighButtonProps } from "./Button";
import { HighAProps } from "./components";
import { HighTableDropdownProps } from "./ProTableComponent";

export interface ElementMap {
  HighButton: HighButtonProps;
  HighA: HighAProps;
  HighTableDropdown: HighTableDropdownProps;
}

export interface ElementProp<T extends ElementMap, K extends keyof T> {
  elementType$: K;
  elementProps$: T[K];
  oid: string;
  elementList?: ElementProp<T, keyof T>;
}

//对应cheng中的OElementItem
export type ElementProps = ElementProp<ElementMap, keyof ElementMap>;

export type ElementListProps = ElementProps[];
