import React, {
  createContext,
  ForwardRefRenderFunction,
  FunctionComponent,
  ReactNode,
  useCallback,
  useContext,
} from "react";
import { get, pick, map, isArray } from "lodash";
import { ElementConfigBase, BaseHighProps, HighProps } from "./types";

type ElementType = FunctionComponent | ForwardRefRenderFunction<any, any>;

type ElementsMap = { [key: string]: ElementType };

export interface HighContextProps {
  name?: string;
  // elements map
  elementsMap: ElementsMap;
  getElement: (elementName: string, priorityMap?: ElementsMap) => ElementType | undefined;
  // icons map
  iconMap?: { [key: string]: ReactNode };
  getIcon: (iconName: string) => ReactNode | undefined;
  //
  getProps: (c: ElementConfigBase) => BaseHighProps;
  render: (
    data: ElementConfigBase | ElementConfigBase[] | undefined | null,
    highProps?: HighProps,
    priorityMap?: ElementsMap,
  ) => ReactNode | ReactNode[] | null;
}

const HighContext = createContext<HighContextProps>({} as any);

export const useHigh = () => useContext(HighContext);

export interface HighProviderProps extends Pick<HighContextProps, "name" | "elementsMap" | "iconMap"> {
  children: ReactNode;
}

export const HighProvider = ({ children, name = "webapp", elementsMap, iconMap }: HighProviderProps) => {
  const getElement = useCallback(
    (elementName: string, priorityMap?: ElementsMap) => get(priorityMap, elementName) || get(elementsMap, elementName),
    [elementsMap],
  );
  const getIcon = useCallback((iconName: string) => get(iconMap, iconName), [iconMap]);

  const getProps = useCallback((c: ElementConfigBase) => {
    const highInject = pick(c, "elementType$", "oid", "elementList");
    return {
      ...c.elementProps$,
      highConfig: {
        ...c.elementProps$?.highConfig,
        highInject,
      },
    } as BaseHighProps;
  }, []);

  const renderElement = useCallback(
    (c?: ElementConfigBase, highProps?: HighProps, priorityMap?: ElementsMap) => {
      if (!c) {
        return undefined;
      }
      const El = getElement(c.elementType$, priorityMap);
      if (!El) {
        return undefined;
      }
      return <El key={c.oid} {...getProps(c)} {...highProps} />;
    },
    [getElement],
  );

  const render = useCallback(
    (
      data: ElementConfigBase | ElementConfigBase[] | undefined | null,
      highProps?: HighProps,
      priorityMap?: ElementsMap,
    ) => {
      if (!data) {
        return null;
      }
      if (isArray(data)) {
        return map(data, (c) => {
          return renderElement(c, highProps, priorityMap);
        });
      }
      return renderElement(data, highProps, priorityMap);
    },
    [renderElement],
  );

  return (
    <HighContext.Provider value={{ name, elementsMap, getElement, iconMap, getIcon, getProps, render }}>
      {children}
    </HighContext.Provider>
  );
};
