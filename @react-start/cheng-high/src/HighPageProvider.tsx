import React, {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  Reducer,
  useCallback,
  useRef,
  ElementType,
  MutableRefObject,
} from "react";
import { reduce, get, set, isArray, head, isObject, tail, indexOf } from "lodash";
import { Subject } from "rxjs";
import { HighAction as Action, HConfig, HighSendEvent, ElementConfigBase, HighProps } from "./types";
import { HighProviderProps, useHigh } from "./HighProvider";

type Values = { [key: string]: any };

interface HighPageContextProps {
  getElement: (elementName: string) => ElementType | undefined;
  renderElement: (c?: ElementConfigBase, highProps?: HighProps) => ReactNode;
  renderElementList: (c: ElementConfigBase[], highProps?: HighProps) => ReactNode[];
  //状态值
  state: Values;
  stateRef: MutableRefObject<Values>;
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
  sendEventSimple: (
    highConfig?: HConfig,
    onSend?: HighSendEvent["onSend"],
    extra?: {
      key?: string;
      payload?: any;
      defaultSend?: boolean;
    },
  ) => void;
}

const HighPageContext = createContext<HighPageContextProps>({} as any);

export const useHighPage = () => useContext(HighPageContext);

export interface HighPageProviderProps {
  elementsMap?: HighProviderProps["elementsMap"];
  children: ReactNode;
}

// deal dynamic data
export const HighPageProvider = ({ children, elementsMap = {} }: HighPageProviderProps) => {
  const {
    getElement: getElementOrigin,
    renderElement: renderElementOrigin,
    renderElementList: renderElementListOrigin,
  } = useHigh();

  const getElement = useCallback(
    (elementName: string) => getElementOrigin(elementName, elementsMap),
    [getElementOrigin, elementsMap],
  );

  const renderElement = useCallback(
    (c?: ElementConfigBase, highProps?: HighProps) => renderElementOrigin(c, highProps, elementsMap),
    [renderElementOrigin, elementsMap],
  );

  const renderElementList = useCallback(
    (elementConfigList: ElementConfigBase[], highProps?: HighProps) =>
      renderElementListOrigin(elementConfigList, highProps, elementsMap),
    [renderElementListOrigin, elementsMap],
  );

  /************************** 页面状态 *****************************/

  const [state, dispatch] = useReducer<Reducer<Values, Action>>((prevState, action) => {
    return { ...prevState, [action.type]: action.payload };
  }, {});

  const stateRef = useRef<Values>(state);
  stateRef.current = state;

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

  const sendEventSimple = useCallback(
    (
      highConfig?: HConfig,
      onSend?: HighSendEvent["onSend"],
      extra?: {
        key?: string;
        payload?: any;
        defaultSend?: boolean; //默认是否发送该事件
      },
    ) => {
      if (!highConfig?.sendEventName) {
        return;
      }
      //如默认不发送，且没有注册，不走发送事件
      const defaultSend = get(extra, "defaultSend", true);
      if (!defaultSend && indexOf(highConfig?.registerEvent || [], extra?.key) === -1) {
        return;
      }
      const suffix = extra?.key ? `:${extra.key}` : "";
      const type = `${highConfig?.sendEventName}${suffix}`;
      const action = { type, payload: extra?.payload };
      if (onSend) {
        onSend(action);
        return;
      }
      sendEvent(action);
    },
    [],
  );

  return (
    <HighPageContext.Provider
      value={{
        getElement,
        renderElement,
        renderElementList,
        state,
        stateRef,
        dispatch,
        getStateValues,
        setDataToRef,
        getDataFromRef,
        subject$,
        sendEvent,
        sendEventSimple,
      }}>
      {children}
    </HighPageContext.Provider>
  );
};
