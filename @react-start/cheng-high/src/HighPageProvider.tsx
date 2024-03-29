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
  useMemo,
} from "react";
import {
  get,
  set,
  isString,
  size,
  map,
  filter,
  pick,
  isArray,
  forEach,
  has,
  concat,
  uniqBy,
  reduce,
  omit,
  join,
} from "lodash";
import { Subject } from "rxjs";
import {
  HighAction as Action,
  HConfig,
  HighSendEvent,
  ElementConfigBase,
  HighProps,
  NamePath,
  TGetValue,
} from "./types";
import { HighProviderProps, useHigh } from "./HighProvider";
import { getFirstPropNameFromNamePath } from "./util";
import { getLodashResult } from "./expression";

type Values = { [key: string]: any };

interface HighPageContextProps {
  render: (
    data: ElementConfigBase | ElementConfigBase[] | undefined | null,
    highProps?: HighProps,
  ) => ReactNode | ReactNode[] | null;
  //状态值
  state: Values;
  stateRef: MutableRefObject<Values>;
  //修改状态
  dispatch: (action: Action) => void;
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
  dataRef: MutableRefObject<Values>;
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
  //发送请求by name
  dispatchRequestByName?: (requestName: string, params?: any, extra?: any) => void;
}

const HighPageContext = createContext<HighPageContextProps>({} as any);

export const useHighPage = () => useContext(HighPageContext);

export interface HighPageProviderProps extends Pick<HighPageContextProps, "dispatchRequestByName"> {
  elementsMap?: HighProviderProps["elementsMap"];
  children?: ReactNode;
}

// deal dynamic data
export const HighPageProvider = ({ children, elementsMap = {}, dispatchRequestByName }: HighPageProviderProps) => {
  const { render: renderOrigin } = useHigh();

  const render = useCallback(
    (data: ElementConfigBase | ElementConfigBase[] | undefined | null, highProps?: HighProps) => {
      return renderOrigin(data, highProps, elementsMap);
    },
    [elementsMap],
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
        multiple?: boolean;
        expression?: TGetValue;
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
        let value: any;

        //如果 multiple 模式
        if (item.multiple && isArray(item.name) && size(item.name) > 0 && item.mapName) {
          //默认取第一个值
          value = get(target || props, item.name[0]);
          const len = size(item.name);
          for (let i = 0; i < len; i++) {
            const temp = get(target || props, item.name[i]);
            //取第一个为"true"的值
            if (temp) {
              value = temp;
              break;
            }
          }
          // set(nextProps, targetName, value);
        } else {
          //赋值
          value = get(target || props, item.name);
          // set(nextProps, targetName, get(target || props, item.name));
        }

        if (item.expression) {
          const getDataTarget = () => ({ value });
          value = getLodashResult(item.expression, getDataTarget);
        }

        set(nextProps, targetName, value);

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
      const allItems = uniqBy(concat(items || [], extraItems || []), "name");

      if (!allItems || size(allItems) <= 0) {
        return props;
      }
      const nextProps = { ...props };

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
              if (item.isFunction) {
                return (...highArgs: any) => render({ ...sub, elementProps$: { ...sub.elementProps$, highArgs } });
              }
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
            if (item.isFunction) {
              set(nextProps, item.name, (...highArgs: any) =>
                render({ ...current, elementProps$: { ...current.elementProps$, highArgs } }),
              );
            } else {
              set(nextProps, item.name, render(current));
            }
          }
        }
      });
      return nextProps;
    },
    [render],
  );

  /************************** 非状态数据 *****************************/

  const dataRef = useRef<Values>({});

  const setDataToRef = useCallback((key: string, data: any) => {
    set(dataRef.current, key, data);
  }, []);

  const getDataFromRef = useCallback((key: string) => {
    return get(dataRef.current, key);
  }, []);

  /************************** 事件处理 *****************************/

  const subject$ = useMemo(() => new Subject<Action>(), []);

  const sendEvent = useCallback((action: Action) => {
    subject$.next(action);
  }, []);

  const sendEventSimple = useCallback(
    (
      highConfig?: HConfig,
      onSend?: HighSendEvent["onSend"],
      extra?: Pick<Action, "payload" | "executeList"> & {
        key?: string;
      },
    ) => {
      if (!highConfig?.sendEventName) {
        return;
      }
      const suffix = extra?.key ? `:${extra.key}` : "";
      const type = `${highConfig?.sendEventName}${suffix}`;
      const action = { type, ...omit(extra, "key") };
      if (onSend) {
        onSend(action);
        return;
      }
      sendEvent(action);
    },
    [],
  );

  /************************** 事件注册穿透 *****************************/

  const getRegisterEventProps = useCallback(
    (items?: HConfig["registerEventList"], props?: Record<string, any>, extraItems?: HConfig["registerEventList"]) => {
      const allItems = uniqBy(concat(items || [], extraItems || []), "name");

      if (!allItems || size(allItems) <= 0) {
        return props;
      }

      const nextProps = { ...props };
      forEach(allItems, (item) => {
        if (!item.name) {
          return;
        }
        let key = "";
        if (isArray(item.name)) {
          key = join(item.name, ":");
        } else {
          key = (item.name as string).replace(new RegExp("\\.", "g"), ":");
        }
        const originFun = get(nextProps, item.name);
        if (get(originFun, "nameKey") === key) {
          return;
        }
        const registerFun = (...e: any[]) => {
          originFun && originFun(...e);
          let payload: any = e;
          if (size(item.transObjList) > 0) {
            payload = reduce(item.transObjList, (pair, trans) => ({ ...pair, [trans.key]: get(e, trans.name) }), {});
          }
          sendEventSimple(props?.highConfig, props?.onSend, { key, payload, executeList: item.executeList });
        };
        registerFun.nameKey = key;
        set(nextProps, item.name, registerFun);
      });
      return nextProps;
    },
    [],
  );

  return (
    <HighPageContext.Provider
      value={{
        render,
        //
        state,
        stateRef,
        dispatch,
        getStateValues,
        getPropsValues,
        getTransformElementProps,
        getRegisterEventProps,
        dataRef,
        setDataToRef,
        getDataFromRef,
        //
        subject$,
        sendEvent,
        sendEventSimple,
        //
        dispatchRequestByName,
      }}>
      {children}
    </HighPageContext.Provider>
  );
};
