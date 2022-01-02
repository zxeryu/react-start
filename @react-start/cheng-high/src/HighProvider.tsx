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
import { get, pick, map, isArray, reduce, keys, filter } from "lodash";
import { ElementConfigBase, BaseHighProps, HighProps } from "./types";
import { useUpdateStateHandle } from "./store/store";
import { IRequestActor, useRequestContext, isDoneRequestActor } from "@react-start/request";
import { filter as rxFilter, tap as rxTap } from "rxjs";
import { useStore } from "@reactorx/core";

type ElementType = FunctionComponent | ForwardRefRenderFunction<any, any>;

type ElementsMap = { [key: string]: ElementType };

export type TDispatchMeta = (requestName: string, req?: IRequestActor["req"], extra?: IRequestActor["extra"]) => void;

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
  //发送全局meta
  dispatchMeta: TDispatchMeta;
}

const HighContext = createContext<HighContextProps>({} as any);

export const useHigh = () => useContext(HighContext);

export interface HighProviderProps extends Pick<HighContextProps, "name" | "elementsMap" | "iconMap"> {
  children: ReactNode;
  requestActorList?: IRequestActor[];
}

export const HighProvider = ({
  children,
  name = "webapp",
  elementsMap,
  iconMap,
  requestActorList,
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
        //新的注册highConfig方式
        ...c.highConfig,
        //旧方式优先级高
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

  const requestActorMap: { [key: string]: IRequestActor } = useMemo(
    () => reduce(requestActorList, (pair, item) => ({ ...pair, [item.name]: item }), {}),
    [],
  );

  //同步meta信息到store中
  useEffect(() => {
    const metaKeySet = new Set(
      filter(keys(requestActorMap), (name) => {
        const actor = requestActorMap[name];
        return actor.req && actor.extra;
      }),
    );
    const sub = requestSubject$
      .pipe(
        rxFilter(isDoneRequestActor),
        rxFilter((actor) => {
          return metaKeySet.has(actor.name);
        }),
        rxTap((actor) => {
          const key = get(actor, ["extra", "storeName"]) || actor.name;
          dispatchStore(key, actor.res?.data);
        }),
      )
      .subscribe();
    return () => {
      sub.unsubscribe();
    };
  }, []);

  const dispatchMeta: TDispatchMeta = useCallback((requestName, req) => {
    const requestActor = get(requestActorMap, requestName);
    if (!requestActor) {
      return;
    }
    const nextRequestActor = { ...requestActor };
    //若标记是重新获取，直接发起请求
    if (req) {
      dispatchRequest(nextRequestActor, req, nextRequestActor.extra);
      return;
    }
    //状态中存储的值
    const storeName = get(nextRequestActor, ["extra", "storeName"]) || nextRequestActor.name;
    const tempData = get(store$.value, storeName);
    //若store中没值，发起请求；如果值已经存在，不用再发起请求
    if (!tempData) {
      dispatchRequest(nextRequestActor, nextRequestActor.req, nextRequestActor.extra);
    }
  }, []);

  return (
    <HighContext.Provider
      value={{
        name,
        elementsMap,
        getElement,
        iconMap,
        getIcon,
        getProps,
        render,
        requestActorMap,
        dispatchStore,
        dispatchMeta,
      }}>
      {children}
    </HighContext.Provider>
  );
};
