import React, {
  createContext,
  ReactNode,
  useContext,
  useReducer,
  Reducer,
  useCallback,
  useRef,
  MutableRefObject,
  isValidElement,
} from "react";
import { get, set, isString, size, map, filter, pick, isArray, forEach, has, concat, uniqBy, last } from "lodash";
import { Subject } from "rxjs";
import {
  HighAction as Action,
  HConfig,
  HighSendEvent,
  ElementConfigBase,
  HighProps,
  HighConfig,
  NamePath,
} from "./types";
import { HighProviderProps, useHigh } from "./HighProvider";
import { getFirstPropNameFromNamePath } from "./util";
import { useUpdateStateHandle } from "./store/store";

type Values = { [key: string]: any };

interface HighPageContextProps {
  render: (
    data: ElementConfigBase | ElementConfigBase[] | undefined | null,
    highProps?: HighProps,
  ) => ReactNode | ReactNode[] | null;
  renderChildren: (highConfig: HighConfig["highConfig"], highProps?: HighProps) => ReactNode | ReactNode[] | null;
  //状态值
  state: Values;
  stateRef: MutableRefObject<Values>;
  //修改状态
  dispatch: (action: Action) => void;
  //修改Store
  dispatchStore: (key: string, value: any) => void;
  //根据key list 从state中获取对应的数据
  getStateValues: (items?: HConfig["receiveStateList"], props?: Record<string, any>) => Values | undefined;
  //根据key list 从props中获取对应的数据
  getPropsValues: (items?: HConfig["receivePropsList"], props?: Record<string, any>) => Values | undefined;
  //根据name list 将props中的组件配置数据转换为react元素
  getTransformElementProps: (
    items?: HConfig["transformElementList"],
    props?: Record<string, any>,
    extraItems?: HConfig["transformElementList"],
  ) => Values | undefined;
  getRegisterEventProps: (
    items?: HConfig["registerEventList"],
    props?: Record<string, any>,
    extraItems?: HConfig["registerEventList"],
  ) => Values | undefined;
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
  const { render: renderOrigin } = useHigh();

  const render = useCallback(
    (data: ElementConfigBase | ElementConfigBase[] | undefined | null, highProps?: HighProps) => {
      return renderOrigin(data, highProps, elementsMap);
    },
    [elementsMap],
  );

  const renderChildren = useCallback(
    (highConfig: HighConfig["highConfig"], highProps?: HighProps) => {
      const children = get(highConfig, ["highInject", "elementList"]);
      return render(children, highProps);
    },
    [render],
  );

  /************************** 页面状态 *****************************/

  const [state, dispatch] = useReducer<Reducer<Values, Action>>((prevState, action) => {
    if (action.type === "compose") {
      return { ...prevState, ...action.payload };
    }
    return { ...prevState, [action.type]: action.payload };
  }, {});

  const stateRef = useRef<Values>(state);
  stateRef.current = state;

  const getValues = useCallback(
    (
      items?: {
        name: NamePath;
        mapName?: NamePath;
      }[],
      props?: Record<string, any>,
      target?: Record<string, any>,
    ) => {
      if (!items || size(items) <= 0 || !props) {
        return undefined;
      }
      //浅拷贝，如果有必要续改为深拷贝
      const nextProps = { ...props };
      //赋值 && 返回一级属性名称
      const firstPropNameList = map(items, (item) => {
        const targetName = item.mapName || item.name;
        //赋值
        set(nextProps, targetName, get(target || props, item.name));
        //返回一级属性名称
        return getFirstPropNameFromNamePath(targetName);
      });
      //返回给变的属性
      return pick(nextProps, filter(firstPropNameList, (firstName) => isString(firstName) && !!firstName) as string[]);
    },
    [],
  );

  const getStateValues = useCallback(
    (items?: HConfig["receiveStateList"], props?: Record<string, any>) => getValues(items, props, state),
    [state],
  );

  const getPropsValues = useCallback(
    (items?: HConfig["receivePropsList"], props?: Record<string, any>) => getValues(items, props),
    [],
  );

  /************************** 组件转换 *****************************/

  const getTransformElementProps = useCallback(
    (
      items?: HConfig["transformElementList"],
      props?: Record<string, any>,
      extraItems?: HConfig["transformElementList"],
    ) => {
      if (!items || size(items) <= 0) {
        return props;
      }
      const nextProps = { ...props };
      const allItems = uniqBy(concat(items, extraItems || []), "name");
      forEach(allItems, (item) => {
        const current = get(props, item.name);

        //没有该属性
        if (!current || (isArray(current) && size(current) <= 0)) {
          return;
        }

        if (isArray(current)) {
          const list = map(current, (sub) => {
            if (isValidElement(sub)) {
              return sub;
            }
            if (has(sub, "elementType$")) {
              return render(sub);
            }
            return sub;
          });
          set(nextProps, item.name, list);
        } else {
          //已经是ReactNode
          if (isValidElement(current)) {
            return;
          }
          //如果当前是组件配置数据，转换成组件
          if (has(current, "elementType$")) {
            set(nextProps, item.name, render(current));
          }
        }
      });
      return nextProps;
    },
    [render],
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

  /************************** 事件穿透 *****************************/

  const getRegisterEventProps = useCallback(
    (items?: HConfig["registerEventList"], props?: Record<string, any>, extraItems?: HConfig["registerEventList"]) => {
      if (!items || size(items) <= 0) {
        return props;
      }
      const nextProps = { ...props };
      const allItems = uniqBy(concat(items, extraItems || []), "name");
      forEach(allItems, (item) => {
        if (!item.name) {
          return;
        }
        let funName = "";
        if (isArray(item.name)) {
          funName = last(item.name) as string;
        } else {
          funName = last((item.name as string).split(".")) as string;
        }
        set(nextProps, item.name, (...e: any[]) => {
          sendEventSimple(props?.highConfig, props?.onSend, { key: funName, payload: e });
        });
      });
      return nextProps;
    },
    [],
  );

  const dispatchStore = useUpdateStateHandle();

  return (
    <HighPageContext.Provider
      value={{
        render,
        renderChildren,
        //
        state,
        stateRef,
        dispatch,
        dispatchStore,
        getStateValues,
        getPropsValues,
        getTransformElementProps,
        getRegisterEventProps,
        setDataToRef,
        getDataFromRef,
        //
        subject$,
        sendEvent,
        sendEventSimple,
      }}>
      {children}
    </HighPageContext.Provider>
  );
};
