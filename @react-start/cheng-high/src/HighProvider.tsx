import React, {
  createContext,
  ForwardRefRenderFunction,
  FunctionComponent,
  ReactNode,
  useCallback,
  useContext,
} from "react";
import { get } from "lodash";

interface HighContextProps {
  // elements map
  elementsMap?: { [key: string]: FunctionComponent | ForwardRefRenderFunction<any, any> };
  getElement: (elementName: string) => ReactNode | undefined;
  // icons map
  iconMap?: { [key: string]: ReactNode };
  getIcon: (iconName: string) => ReactNode | undefined;
}

const HighContext = createContext<HighContextProps>({} as any);

export const useHigh = () => useContext(HighContext);

export const HighProvider = ({ children, elementsMap, iconMap }: HighContextProps & { children: ReactNode }) => {
  const getElement = useCallback((elementName: string) => get(elementsMap, elementName), [elementsMap]);
  const getIcon = useCallback((iconName: string) => get(iconMap, iconName), [iconMap]);
  return <HighContext.Provider value={{ elementsMap, getElement, iconMap, getIcon }}>{children}</HighContext.Provider>;
};
