import { HConfig, HighProps } from "./types";
import { useHighPage } from "./HighPageProvider";
import React from "react";
import { get } from "lodash";

export const ComponentWrapper = <T extends HighProps>({
  Component,
  renderChild,
  transformElementList,
  registerEventList,
  //
  hidden,
  ...otherProps
}: T & {
  Component: any;
  renderChild?: boolean;
  transformElementList?: HConfig["transformElementList"];
  registerEventList?: HConfig["registerEventList"];
}) => {
  const { getStateValues, getPropsValues, getTransformElementProps, getRegisterEventProps, renderChildren } =
    useHighPage();

  const highConfig: HConfig | undefined = get(otherProps, "highConfig");

  //props转换
  const propsProps = getPropsValues(highConfig?.receivePropsList, otherProps);

  //组件转换
  const transformElementProps = getTransformElementProps(
    highConfig?.transformElementList,
    otherProps,
    transformElementList,
  );

  //事件注册
  const registerEventProps = getRegisterEventProps(
    highConfig?.registerEventList,
    transformElementProps,
    registerEventList,
  );

  //state转换
  const stateProps = getStateValues(highConfig?.receiveStateList, registerEventProps);

  if (get(stateProps, "hidden", hidden)) {
    return null;
  }

  if (renderChild) {
    return (
      <Component {...registerEventProps} {...propsProps} {...stateProps}>
        {renderChildren(highConfig)}
      </Component>
    );
  }

  return <Component {...registerEventProps} {...propsProps} {...stateProps} />;
};
