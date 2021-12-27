import { HighPageProvider, HighPageProviderProps, useHighPage } from "./HighPageProvider";
import React, { useCallback, useEffect, useMemo } from "react";
import { ElementConfigBase, TDataType, TExecuteItem, TExecuteType, TGetValue } from "./types";
import { uniq, filter, get, concat, size, reduce, forEach, keys, cloneDeep } from "lodash";
import { useStore, shallowEqual } from "@reactorx/core";
import { tap as rxTap } from "rxjs";
import { map as rxOperatorMap, distinctUntilChanged } from "rxjs/operators";
import { useHigh } from "./HighProvider";
import { useRequestContext, IRequestActor } from "@react-start/request";
import { useComposeRequestActor } from "./request";
import { useDomEvent } from "./render";
import { getExecuteParams, getLodashResult } from "./expression";

export interface IConfigData {
  //初始状态
  initialState?: Record<string, any>;
  //初始状态（表达式）
  initialExpressionList?: {
    stateName: string;
    expression: TGetValue;
  }[];
  registerStore?: string[];
  //api name
  registerMeta?: string[];
  // request
  registerRequest?: {
    requestName: string;
    //若不设置该字段，默认使用requestName
    stateName?: string;
    //如果设置该字段，会在状态中生成[loadingName]的boolean类型字段，表示网络请求状态
    loadingName?: string;
    //拓展，执行注册的逻辑
    executeList?: TExecuteItem[];
  }[];
  page: ElementConfigBase | ElementConfigBase[];
}

export interface HighPageProps extends HighPageProviderProps {
  configData: IConfigData;
  requestActorMap?: { [key: string]: IRequestActor };
}

const Content = ({ configData, requestActorMap }: Omit<HighPageProps, "elementsMap" | "children">) => {
  const store$ = useStore();
  const { dispatchRequest } = useRequestContext();
  const { requestActorMap: baseRequestActorMap, dispatchStore, dispatchMeta } = useHigh();
  const { render, dispatch, stateRef, dataRef, setDataToRef } = useHighPage();

  const dispatchRequestByName = useCallback((requestName: string, params: Record<string, any>) => {
    const requestActor = get(requestActorMap, requestName) || get(baseRequestActorMap, requestName);
    if (!requestActor) {
      return;
    }
    dispatchRequest(requestActor, params);
  }, []);

  useEffect(() => {
    if (configData.initialState) {
      dispatch({ type: "compose", payload: configData.initialState });
    }
    if (configData.initialExpressionList) {
      const eState = reduce(
        configData.initialExpressionList,
        (pair, item) => {
          return {
            ...pair,
            [item.stateName]: getLodashResult(item.expression),
          };
        },
        {},
      );
      dispatch({ type: "compose", payload: eState });
    }
  }, []);

  /******************************** 执行注册的逻辑 ************************************/

  const createGetDataTarget = useCallback((argumentsTarget: any) => {
    return (type: TDataType) => {
      switch (type) {
        case "state":
          return stateRef.current;
        case "dataRef":
          return dataRef.current;
        case "arguments":
          return argumentsTarget;
      }
      return argumentsTarget;
    };
  }, []);

  const execute = useCallback((executeList: TExecuteItem[], getDataTarget: (type: TDataType) => any) => {
    if (!executeList || size(executeList) <= 0) {
      return;
    }
    forEach(executeList, (item) => {
      const executeName: TExecuteType | undefined = get(item, "execName");
      if (!executeName) {
        return;
      }
      const execParams: any[] = getExecuteParams(item, getDataTarget);
      switch (executeName) {
        case "dispatch":
          if (execParams[0]) {
            dispatch({ type: execParams[0], payload: execParams[1] });
          }
          break;
        case "dispatchStore":
          if (execParams[0]) {
            dispatchStore(execParams[0], execParams[1]);
          }
          break;
        case "dispatchMeta":
          if (execParams[0]) {
            dispatchMeta(execParams[0], execParams[1]);
          }
          break;
        case "setDataToRef":
          if (execParams[0]) {
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
  }, []);

  /******************************** store store-meta 同步到 state ************************************/
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

  /******************************** request 同步到 state ************************************/

  const requestMap = useMemo(
    () => reduce(get(configData, "registerRequest", []), (pair, item) => ({ ...pair, [item.requestName]: item }), {}),
    [],
  );

  useComposeRequestActor(keys(requestMap), {
    onStart: (actor) => {
      const loadingName = get(requestMap, [actor.name, "loadingName"]);
      if (loadingName) {
        dispatch({ type: loadingName, payload: true });
      }
    },
    onSuccess: (actor) => {
      const executeList = get(requestMap, [actor.name, "executeList"]);
      if (executeList && size(executeList) > 0) {
        const getDataTarget = createGetDataTarget(actor.res?.data);
        execute(executeList, getDataTarget);
        return;
      }
      const stateName = get(requestMap, [actor.name, "stateName"]);
      if (stateName) {
        dispatch({ type: stateName, payload: actor.res?.data });
      }
    },
    onFinish: (actor) => {
      const loadingName = get(requestMap, [actor.name, "loadingName"]);
      if (loadingName) {
        dispatch({ type: loadingName, payload: false });
      }
    },
  });

  /******************************** 响应事件 ************************************/

  //处理注册的事件execute
  useDomEvent((action) => {
    if (!action.executeList || size(action.executeList) <= 0) {
      return;
    }

    const getDataTarget = createGetDataTarget(action.payload);

    execute(action.executeList, getDataTarget);
  });

  /**
   * 防止初始化对象修改而影响状态 如：组件再hidden和show切换之后会保留之前注册的事件对象
   */
  const renderPageData = useMemo(() => cloneDeep(configData.page), []);

  return <>{render(renderPageData)}</>;
};

//处理 store store-meta
export const HighPage = ({ elementsMap, children, ...otherProps }: HighPageProps) => (
  <HighPageProvider elementsMap={elementsMap}>
    <Content {...otherProps} />
    {children}
  </HighPageProvider>
);
