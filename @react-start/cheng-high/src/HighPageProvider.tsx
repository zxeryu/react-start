import React, { createContext, ReactNode, useContext, useReducer, Reducer, useCallback, useRef } from "react";
import { reduce, get, set, isArray, head, isObject, tail } from "lodash";
import { Subject } from "rxjs";
import { HighAction as Action, HConfig } from "./types";

type Values = { [key: string]: any };

interface HighPageContextProps {
  //状态值
  state: Values;
  //修改状态
  dispatch: (action: Action) => void;
  //根据key list 从state中获取对应的数据
  getStateValues: (items?: HConfig["receiveStateList"], props?: Record<string, any>) => Values | undefined;
  setDataToRef: (key: string, data: any) => void;
  getDataFromRef: (key: string) => any;
  //事件处理对象（rx）
  subject$: Subject<Action>;
  //发送事件
  sendEvent: (action: Action) => void;
}

const HighPageContext = createContext<HighPageContextProps>({} as any);

export const useHighPage = () => useContext(HighPageContext);

// deal dynamic data
export const HighPageProvider = ({ children }: { children: ReactNode }) => {
  /************************** 页面状态 *****************************/

  const [state, dispatch] = useReducer<Reducer<Values, Action>>((prevState, action) => {
    return { ...prevState, [action.type]: action.payload };
  }, {});

  const getStateValues = useCallback(
    (items?: HConfig["receiveStateList"], props?: Record<string, any>) => {
      if (!items) {
        return undefined;
      }
      return reduce(
        items,
        (pair, item) => {
          const targetName = item.mapName || item.name;
          let firstPropName: string | number;
          if (isArray(targetName)) {
            firstPropName = head(targetName) as string | number;
          } else {
            firstPropName = targetName;
          }
          //props中的配置
          const targetProps = get(props || {}, firstPropName);
          //需要订阅的状态值
          const value = get(state, item.name);
          //目标属性是对象
          let mergeProps;
          if (isObject(targetProps)) {
            mergeProps = { ...targetProps };
            //未标记的话模式用name属性
            const path = item.mapName || item.name;

            set(mergeProps, isArray(path) ? tail(path) : path, value);
          }
          const isO = get(item, "isObject");
          return {
            ...pair,
            [firstPropName]: isObject(targetProps) ? mergeProps : isO ? { value } : value,
          };
        },
        {},
      );
    },
    [state],
  );

  /************************** 非状态数据 *****************************/

  const dataRef = useRef<{ [key: string]: any }>({});

  const setDataToRef = useCallback((key: string, data: any) => {
    set(dataRef.current, key, data);
  }, []);

  const getDataFromRef = useCallback((key: string) => {
    return get(dataRef.current, key);
  }, []);

  /************************** 事件处理 *****************************/

  const subject$ = new Subject<Action>();

  const sendEvent = useCallback((action: Action) => {
    subject$.next(action);
  }, []);

  return (
    <HighPageContext.Provider
      value={{ state, dispatch, getStateValues, setDataToRef, getDataFromRef, subject$, sendEvent }}>
      {children}
    </HighPageContext.Provider>
  );
};
