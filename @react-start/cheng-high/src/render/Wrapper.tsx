import { HConfig, HighProps } from "../types";
import { useHighPage } from "../HighPageProvider";
import React, { useCallback } from "react";
import { get, omit, isUndefined, size, map } from "lodash";

type ShowHiddenType = boolean | undefined;

/**
 * 判断顺序 stateShow，stateHidden，show，hidden
 * 先判断state中的属性，如果都不存在，再判断props中的属性
 * @param stateShow
 * @param stateHidden
 * @param show
 * @param hidden
 */
const isShow = (
  stateShow: ShowHiddenType,
  stateHidden: ShowHiddenType,
  show: ShowHiddenType,
  hidden: ShowHiddenType,
) => {
  if (stateShow) {
    return true;
  }
  if (!isUndefined(stateShow)) {
    return false;
  }
  if (stateHidden) {
    return false;
  }
  if (!isUndefined(stateHidden)) {
    return true;
  }
  if (show) {
    return true;
  }
  if (!isUndefined(show)) {
    return false;
  }
  if (hidden) {
    return false;
  }
  if (!isUndefined(hidden)) {
    return true;
  }
  return true;
};

export interface ComponentWrapperProps extends HighProps {
  Component: any;
  noChild?: boolean;
  transformElementList?: HConfig["transformElementList"];
  registerEventList?: HConfig["registerEventList"];
  [k: string]: any;
}

export const ComponentWrapper = ({
  Component,
  noChild,
  transformElementList,
  registerEventList,
  //
  hidden,
  show,
  ...otherProps
}: ComponentWrapperProps) => {
  const { getStateValues, getPropsValues, getTransformElementProps, getRegisterEventProps, render } = useHighPage();

  const highConfig: HConfig | undefined = get(otherProps, "highConfig");

  //重写props属性
  const transProps = useCallback(
    (props: any) => {
      //替换（注册）事件
      const registerEventProps = getRegisterEventProps(highConfig?.registerEventList, props, registerEventList);
      //替换UI
      return getTransformElementProps(highConfig?.transformElementList, registerEventProps, transformElementList);
    },
    [getTransformElementProps],
  );

  const rewriteProps = transProps(otherProps);

  //props转换
  const propsProps = getPropsValues(highConfig?.receivePropsList, rewriteProps);

  //state转换
  const stateProps = getStateValues(highConfig?.receiveStateList, rewriteProps);

  const visible = isShow(get(stateProps, "show"), get(stateProps, "hidden"), show, hidden);
  if (!visible) {
    return null;
  }

  let targetProps = omit(rewriteProps, "highConfig", "onSend");
  if (highConfig?.omitProps && size(highConfig.omitProps) > 0) {
    targetProps = omit(targetProps, ...map(highConfig.omitProps, (item) => item.name));
  }

  const realStateProps = omit(stateProps, "show", "hidden");

  if (noChild) {
    return <Component {...targetProps} {...propsProps} {...realStateProps} />;
  }

  return (
    <Component {...targetProps} {...propsProps} {...realStateProps}>
      {realStateProps?.children || propsProps?.children || targetProps.children}
      {render(get(highConfig, ["highInject", "elementList"]))}
    </Component>
  );
};
