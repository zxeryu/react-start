import React, { createContext, ReactNode, useContext, useReducer, Reducer, useCallback } from "react";
import { pick, map, reduce, get } from "lodash";
import { Subject } from "rxjs";
import { HighEvent } from "./types";

type Values = { [key: string]: any };

type Action = { type: string; payload?: any };

interface HighPageContextProps {
  //状态值
  state: Values;
  //修改状态
  dispatch: (action: Action) => void;
  //事件处理对象（rx）
  subject$: Subject<Action>;
  //发送事件
  sendEvent: (action: Action) => void;
  //根据key list 从state中获取对应的数据
  getStateValues: (items?: HighEvent["receiveStateList"]) => Values | undefined;
}

const HighPageContext = createContext<HighPageContextProps>({} as any);

export const useHighPage = () => useContext(HighPageContext);

// deal dynamic data
export const HighPageProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer<Reducer<Values, Action>>((prevState, action) => {
    return { ...prevState, [action.type]: action.payload };
  }, {});

  const getStateValues = useCallback(
    (items?: HighEvent["receiveStateList"]) => {
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

  /************************** 事件处理 *****************************/

  const subject$ = new Subject<Action>();

  const sendEvent = useCallback((action: Action) => {
    subject$.next(action);
  }, []);

  return (
    <HighPageContext.Provider value={{ state, dispatch, getStateValues, subject$, sendEvent }}>
      {children}
    </HighPageContext.Provider>
  );
};
