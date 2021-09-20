import { HighButtonProps } from "./Button";
import { HighAProps } from "./components";

type ElementMap = {
  HighButton: HighButtonProps;
  HighA: HighAProps;
};

export interface ElementProps<T extends keyof ElementMap> {
  elementType$: T;
  elementProps$: ElementMap[T];
  oid?: string | number;
}

export type ElementListProps = ElementProps<keyof ElementMap>[];
