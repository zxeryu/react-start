import React, {
  createContext,
  ForwardRefRenderFunction,
  FunctionComponent,
  ReactNode,
  useCallback,
  useContext,
} from "react";
import { get, pick, map } from "lodash";
import { ElementConfigBase, BaseHighProps, HighProps } from "./types";

type ElementType = FunctionComponent | ForwardRefRenderFunction<any, any>;

type HighExtraProps = Omit<HighProps, "highInject">;

interface HighContextProps {
  // elements map
  elementsMap: { [key: string]: ElementType };
  getElement: (elementName: string) => ElementType | undefined;
  // icons map
  iconMap?: { [key: string]: ReactNode };
  getIcon: (iconName: string) => ReactNode | undefined;
  //
  getProps: (c: ElementConfigBase) => BaseHighProps;
  renderElement: (c: ElementConfigBase, highProps?: HighExtraProps) => ReactNode;
  renderElementList: (c: ElementConfigBase[], highProps?: HighExtraProps) => ReactNode[];
}

const HighContext = createContext<HighContextProps>({} as any);

export const useHigh = () => useContext(HighContext);

export interface HighProviderProps extends Pick<HighContextProps, "elementsMap" | "iconMap"> {
  children: ReactNode;
}

export const HighProvider = ({ children, elementsMap, iconMap }: HighProviderProps) => {
  const getElement = useCallback((elementName: string) => get(elementsMap, elementName), [elementsMap]);
  const getIcon = useCallback((iconName: string) => get(iconMap, iconName), [iconMap]);

  const getProps = useCallback((c: ElementConfigBase) => {
    const highInject = pick(c, "elementType$", "oid", "elementList");
    return {
      ...c.elementProps$,
      highInject,
    } as BaseHighProps;
  }, []);

  const renderElement = useCallback(
    (c: ElementConfigBase, highProps?: HighExtraProps) => {
      const El = getElement(c.elementType$);
      if (!El) {
        return null;
      }
      return <El key={c.oid} {...getProps(c)} {...highProps} />;
    },
    [getElement],
  );

  const renderElementList = useCallback(
    (elementConfigList: ElementConfigBase[], highProps?: HighExtraProps) => {
      return map(elementConfigList, (c) => renderElement(c, highProps));
    },
    [renderElement],
  );

  return (
    <HighContext.Provider
      value={{ elementsMap, getElement, iconMap, getIcon, getProps, renderElement, renderElementList }}>
      {children}
    </HighContext.Provider>
  );
};
