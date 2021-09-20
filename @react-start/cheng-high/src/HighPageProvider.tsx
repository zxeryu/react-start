import React, { createContext, ReactNode, useContext, useReducer, Reducer, useCallback, useRef } from "react";
import { pick, map, reduce, get, set } from "lodash";
import { Subject } from "rxjs";
import { HighAction as Action, HConfig } from "./types";

type Values = { [key: string]: any };

interface HighPageContextProps {
  //状态值
  state: Values;
  //修改状态
  dispatch: (action: Action) => void;
  //根据key list 从state中获取对应的数据
  getStateValues: (items?: HConfig["receiveStateList"]) => Values | undefined;
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
    (items?: HConfig["receiveStateList"]) => {
      if (!items) {
        return undefined;
      }
      const targetValue = pick(
        state,
        map(items, (item) => item.name),
      );
      return reduce(
        items,
        (pair, item) => ({
          ...item,
          [item.mapName || item.name]: get(targetValue, item.name),
        }),
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
