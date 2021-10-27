import { HighProps } from "./types";
import { useHighPage } from "./HighPageProvider";
import React from "react";

export const ComponentWrapper = <T extends HighProps>({
  Component,
  renderChild,
  //
  hidden,
  highConfig,
  ...otherProps
}: T & {
  Component: any;
  renderChild?: boolean;
}) => {
  const { getStateValues, getPropsValues, renderChildren } = useHighPage();

  if (hidden) {
    return null;
  }

  const propsProps = getPropsValues(highConfig?.receivePropsList, otherProps);
  const stateProps = getStateValues(highConfig?.receiveStateList, otherProps);

  if (renderChild) {
    return (
      <Component {...otherProps} {...propsProps} {...stateProps}>
        {renderChildren(highConfig)}
      </Component>
    );
  }

  return <Component {...otherProps} {...propsProps} {...stateProps} />;
};
