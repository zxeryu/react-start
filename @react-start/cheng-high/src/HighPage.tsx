import { HighPageProvider, HighPageProviderProps, useHighPage } from "./HighPageProvider";
import React, { useCallback, useEffect, useMemo } from "react";
import { ElementConfigBase, TDataType, TExecuteType } from "./types";
import { uniq, filter, get, concat, size, reduce, forEach, keys } from "lodash";
import { useStore, shallowEqual } from "@reactorx/core";
import { tap as rxTap } from "rxjs";
import { map as rxOperatorMap, distinctUntilChanged } from "rxjs/operators";
import { useHigh } from "./HighProvider";
import { useRequestContext, IRequestActor } from "@react-start/request";
import { useComposeRequestActor } from "./request";
import { useDomEvent } from "./render";
import { getExecuteParams } from "./expression";

export interface HighPageProps extends HighPageProviderProps {
  configData: {
    registerStore?: string[];
    //api name
    registerMeta?: string[];
    // request
    registerRequest?: {
      requestName: string;
      //若不设置该字段，默认使用requestName
      storeName?: string;
      //如果设置该字段，会在状态中生成[loadingName]的boolean类型字段，表示网络请求状态
      loadingName?: string;
    }[];
    page: ElementConfigBase | ElementConfigBase[];
  };
  requestActorMap?: { [key: string]: IRequestActor };
}

const Content = ({ configData, requestActorMap }: Omit<HighPageProps, "elementsMap" | "children">) => {
  const store$ = useStore();
  const { dispatchRequest } = useRequestContext();
  const { requestActorMap: baseRequestActorMap, dispatchStore, dispatchMeta } = useHigh();
  const { render, dispatch, stateRef, dataRef, setDataToRef } = useHighPage();

  //将注册的 store store-meta绑定到state中
  useEffect(() => {
    const list = concat(get(configData, "registerStore", []), get(configData, "registerMeta", []));
    const storeKeyList = filter(uniq(list), (item) => !!item);

    if (size(storeKeyList) <= 0) {
      return;
    }

    const sub = store$
      .pipe(
        rxOperatorMap((state) => {
          return reduce(
            storeKeyList,
            (pair, key) => {
              return { ...pair, [key]: get(state, key) };
            },
            {},
          );
        }),
        distinctUntilChanged(shallowEqual),
        rxTap((c) => {
          dispatch({ type: "compose", payload: c });
        }),
      )
      .subscribe();

    return () => {
      sub.unsubscribe();
    };
  }, []);

  //如果注册了 registerMeta ，在page初始化的时候发送
  useEffect(() => {
    const metaNameList = get(configData, "registerMeta", []);
    forEach(metaNameList, (requestName) => {
      dispatchMeta(requestName);
    });
  }, []);

  /******************************** request ************************************/

  const requestMap = useMemo(
    () => reduce(get(configData, "registerRequest", []), (pair, item) => ({ ...pair, [item.requestName]: item }), {}),
    [],
  );

  useComposeRequestActor(keys(requestMap), {
    onStart: (actor) => {
      const loadingName = get(requestMap, [actor.name, "loadingName"]);
      if (loadingName) {
        dispatchStore(loadingName, true);
      }
    },
    onSuccess: (actor) => {
      const storeName = get(requestMap, [actor.name, "storeName"]);
      if (storeName) {
        dispatchStore(storeName, actor.res?.data);
      }
    },
    onFinish: (actor) => {
      const loadingName = get(requestMap, [actor.name, "loadingName"]);
      if (loadingName) {
        dispatchStore(loadingName, false);
      }
    },
  });

  const dispatchRequestByName = useCallback((requestName: string, params: Record<string, any>) => {
    const requestActor = get(requestActorMap, requestName) || get(baseRequestActorMap, requestName);
    if (!requestActor) {
      return;
    }
    dispatchRequest(requestActor, params);
  }, []);

  /******************************** 响应事件 ************************************/

  //处理注册的事件execute
  useDomEvent((action) => {
    if (!action.executeList || size(action.executeList) <= 0) {
      return;
    }

    const getDataTarget = (type: TDataType) => {
      switch (type) {
        case "state":
          return stateRef.current;
        case "dataRef":
          return dataRef.current;
        case "arguments":
          return action.payload;
      }
      return stateRef.current;
    };

    forEach(action.executeList, (item) => {
      const executeName: TExecuteType | undefined = get(item, "execName");
      if (!executeName) {
        return;
      }
      const execParams: any[] = getExecuteParams(item, getDataTarget);
      switch (executeName) {
        case "dispatch":
          if (execParams[0] && execParams[1]) {
            dispatch({ type: execParams[0], payload: execParams[1] });
          }
          break;
        case "dispatchStore":
          if (execParams[0] && execParams[1]) {
            dispatchStore(execParams[0], execParams[1]);
          }
          break;
        case "dispatchMeta":
          if (execParams[0]) {
            dispatchMeta(execParams[0], execParams[1]);
          }
          break;
        case "setDataToRef":
          if (execParams[0] && execParams[1]) {
            setDataToRef(execParams[0], execParams[1]);
          }
          break;
        case "dispatchRequest":
          if (execParams[0] && execParams[1]) {
            dispatchRequestByName(execParams[0], execParams[1]);
          }
          break;
      }
    });
  });

  return <>{render(configData.page)}</>;
};

//处理 store store-meta
export const HighPage = ({ elementsMap, children, ...otherProps }: HighPageProps) => (
  <HighPageProvider elementsMap={elementsMap}>
    <Content {...otherProps} />
    {children}
  </HighPageProvider>
);
