import React, {
  createContext,
  ForwardRefRenderFunction,
  FunctionComponent,
  ReactNode,
  useCallback,
  useContext,
} from "react";
import { get } from "lodash";

type ElementType = FunctionComponent | ForwardRefRenderFunction<any, any>;

interface HighContextProps {
  // elements map
  elementsMap: { [key: string]: ElementType };
  getElement: (elementName: string) => ElementType | undefined;
  // icons map
  iconMap?: { [key: string]: ReactNode };
  getIcon: (iconName: string) => ReactNode | undefined;
}

const HighContext = createContext<HighContextProps>({} as any);

export const useHigh = () => useContext(HighContext);

export interface HighProviderProps extends Pick<HighContextProps, "elementsMap" | "iconMap"> {
  children: ReactNode;
}

export const HighProvider = ({ children, elementsMap, iconMap }: HighProviderProps) => {
  const getElement = useCallback((elementName: string) => get(elementsMap, elementName), [elementsMap]);
  const getIcon = useCallback((iconName: string) => get(iconMap, iconName), [iconMap]);
  return <HighContext.Provider value={{ elementsMap, getElement, iconMap, getIcon }}>{children}</HighContext.Provider>;
};
