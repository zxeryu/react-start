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
import { get, set, isString, indexOf, size, map, filter, pick, isArray } from "lodash";
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

type Values = { [key: string]: any };

interface HighPageContextProps {
  getElement: (elementName: string) => ElementType | undefined;
  renderElement: (c?: ElementConfigBase, highProps?: HighProps) => ReactNode;
  renderElementList: (c: ElementConfigBase[], highProps?: HighProps) => ReactNode[];
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
  //根据key list 从state中获取对应的数据
  getStateValues: (items?: HConfig["receiveStateList"], props?: Record<string, any>) => Values | undefined;
  //根据key list 从props中获取对应的数据
  getPropsValues: (items?: HConfig["receivePropsList"], props?: Record<string, any>) => Values | undefined;
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

  const render = useCallback(
    (data: ElementConfigBase | ElementConfigBase[] | undefined | null, highProps?: HighProps) => {
      if (!data) {
        return null;
      }
      if (isArray(data)) {
        return renderElementList(data, highProps);
      }
      return renderElement(data, highProps);
    },
    [renderElement, renderElementList],
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
        render,
        renderChildren,
        state,
        stateRef,
        dispatch,
        getStateValues,
        getPropsValues,
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
