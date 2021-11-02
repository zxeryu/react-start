import { HConfig, HighProps } from "./types";
import { useHighPage } from "./HighPageProvider";
import React from "react";
import { get } from "lodash";

export const ComponentWrapper = <T extends HighProps>({
  Component,
  renderChild,
  transformElementList,
  //
  hidden,
  highConfig,
  ...otherProps
}: T & {
  Component: any;
  renderChild?: boolean;
  transformElementList?: HConfig["transformElementList"];
}) => {
  const { getStateValues, getPropsValues, getTransformElementProps, renderChildren } = useHighPage();

  //props转换
  const propsProps = getPropsValues(highConfig?.receivePropsList, otherProps);

  //组件转换
  const transformElementProps = getTransformElementProps(
    highConfig?.transformElementList,
    otherProps,
    transformElementList,
  );

  //state转换
  const stateProps = getStateValues(highConfig?.receiveStateList, transformElementProps);

  if (get(stateProps, "hidden", hidden)) {
    return null;
  }

  if (renderChild) {
    return (
      <Component {...transformElementProps} {...propsProps} {...stateProps}>
        {renderChildren(highConfig)}
      </Component>
    );
  }

  return <Component {...otherProps} {...propsProps} {...stateProps} />;
};
