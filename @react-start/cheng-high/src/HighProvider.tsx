import React, {
  createContext,
  ForwardRefRenderFunction,
  FunctionComponent,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { get, set, pick, map, isArray, reduce, keys } from "lodash";
import { ElementConfigBase, BaseHighProps, HighProps } from "./types";
import { useUpdateStateHandle } from "./store/store";
import { IRequestActor, useRequestContext } from "@react-start/request";
import { filter as rxFilter, tap as rxTap } from "rxjs";
import { useStore } from "@reactorx/core";

type ElementType = FunctionComponent | ForwardRefRenderFunction<any, any>;

type ElementsMap = { [key: string]: ElementType };

export type TDispatchMeta = (
  requestName: string,
  options?: {
    reGetData: boolean;
    params?: Record<string, any>;
  },
) => void;

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
  //修改Store
  dispatchStore: (key: string, value: any) => void;
  //request
  metaList?: {
    requestActor: IRequestActor;
    initialParams?: Record<string, any>;
    storeName?: string;
  }[];
  dispatchMeta: TDispatchMeta;
}

const HighContext = createContext<HighContextProps>({} as any);

export const useHigh = () => useContext(HighContext);

export interface HighProviderProps extends Pick<HighContextProps, "name" | "elementsMap" | "iconMap" | "metaList"> {
  children: ReactNode;
}

export const HighProvider = ({ children, name = "webapp", elementsMap, iconMap, metaList }: HighProviderProps) => {
  const store$ = useStore();
  const { dispatchRequest, requestSubject$ } = useRequestContext();

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

  const dispatchStore = useUpdateStateHandle();

  const metaMap = useMemo(() => {
    return reduce(
      metaList,
      (pair, item) => {
        const nextItem = { ...item };
        if (item.storeName) {
          set(nextItem, ["requestActor", "name"], item.storeName);
        }
        return { ...pair, [nextItem.requestActor.name]: nextItem };
      },
      {},
    );
  }, []);

  //同步meta信息到store中
  useEffect(() => {
    const metaKeySet = new Set(keys(metaMap));
    const sub = requestSubject$
      .pipe(
        rxFilter((actor) => {
          return metaKeySet.has(actor.name);
        }),
        rxTap((actor) => {
          dispatchStore(actor.name, actor.res?.data);
        }),
      )
      .subscribe();
    return () => {
      sub.unsubscribe();
    };
  }, []);

  //如果值已经存在，不用再发起请求
  const dispatchMeta: TDispatchMeta = useCallback(
    (requestName, options) => {
      const metaData = get(metaMap, requestName);

      if (!metaData) {
        return;
      }

      //若标记是重新获取
      if (get(options, "reGetData")) {
        dispatchRequest(metaData.requestActor, get(options, "params") || metaData.initialParams);
        return;
      }

      //状态中存储的值
      const tempData = get(store$.value, requestName);

      //若store中没值，发起请求
      if (!tempData) {
        dispatchRequest(metaData.requestActor, metaData.initialParams);
      }
    },
    [metaMap],
  );

  return (
    <HighContext.Provider
      value={{ name, elementsMap, getElement, iconMap, getIcon, getProps, render, dispatchStore, dispatchMeta }}>
      {children}
    </HighContext.Provider>
  );
};
