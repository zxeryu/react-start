import { HighButtonProps } from "./Button";
import { HighAProps } from "./components";
import { HighTableDropdownProps } from "./ProTableComponent";
import { HighTableProps } from "./ProTable";

export interface ElementMap {
  HighButton: HighButtonProps;
  HighA: HighAProps;
  HighTable: HighTableProps;
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
