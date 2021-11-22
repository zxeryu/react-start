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
import { IRequestActor, useRequestContext, isDoneRequestActor } from "@react-start/request";
import { filter as rxFilter, tap as rxTap } from "rxjs";
import { useStore } from "@reactorx/core";

type ElementType = FunctionComponent | ForwardRefRenderFunction<any, any>;

type ElementsMap = { [key: string]: ElementType };

export type TDispatchMeta = (
  storeName: string,
  options?: {
    reGetData: boolean;
    params?: Record<string, any>;
  },
) => void;

export interface IStoreRequestActor extends IRequestActor {
  opts?: {
    storeName?: string;
  };
}

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
  requestActorMap?: { [key: string]: IRequestActor };
  //修改Store
  dispatchStore: (key: string, value: any) => void;
  //request
  metaList?: {
    requestName: string;
    initialParams?: Record<string, any>;
    //状态中的key
    storeName?: string;
  }[];
  dispatchMeta: TDispatchMeta;
}

const HighContext = createContext<HighContextProps>({} as any);

export const useHigh = () => useContext(HighContext);

export interface HighProviderProps
  extends Pick<HighContextProps, "name" | "elementsMap" | "iconMap" | "metaList" | "requestActorMap"> {
  children: ReactNode;
}

export const HighProvider = ({
  children,
  name = "webapp",
  elementsMap,
  iconMap,
  requestActorMap,
  metaList,
}: HighProviderProps) => {
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

  const { metaMap, metaStoreMap } = useMemo(
    () => ({
      metaMap: reduce(metaList, (pair, item) => ({ ...pair, [item.requestName]: item }), {}),
      metaStoreMap: reduce(metaList, (pair, item) => ({ ...pair, [item.storeName || item.requestName]: item }), {}),
    }),
    [],
  );

  //同步meta信息到store中
  useEffect(() => {
    const metaKeySet = new Set(keys(metaMap));
    const sub = requestSubject$
      .pipe(
        rxFilter(isDoneRequestActor),
        rxFilter((actor) => {
          return metaKeySet.has(actor.name);
        }),
        rxTap((actor) => {
          const key = get(actor, ["opts", "storeName"]) || actor.name;
          dispatchStore(key, actor.res?.data);
        }),
      )
      .subscribe();
    return () => {
      sub.unsubscribe();
    };
  }, []);

  const dispatchMeta: TDispatchMeta = useCallback(
    (storeName, options) => {
      const metaData = get(metaStoreMap, storeName);
      if (!metaData) {
        return;
      }
      const requestActor = get(requestActorMap, metaData.requestName);
      if (!requestActor) {
        return;
      }
      const nextRequestActor: IStoreRequestActor = { ...requestActor };
      if (metaData.storeName) {
        set(nextRequestActor, ["opts", "storeName"], metaData.storeName);
      }
      //若标记是重新获取，直接发起请求
      if (get(options, "reGetData")) {
        dispatchRequest(nextRequestActor, get(options, "params") || metaData.initialParams);
        return;
      }
      //状态中存储的值
      const tempData = get(store$.value, storeName);
      //若store中没值，发起请求；如果值已经存在，不用再发起请求
      if (!tempData) {
        dispatchRequest(nextRequestActor, metaData.initialParams);
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
