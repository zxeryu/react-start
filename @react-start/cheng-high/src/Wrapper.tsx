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
  const { getStateValues, renderChildren } = useHighPage();

  if (hidden) {
    return null;
  }

  const stateProps = getStateValues(highConfig?.receiveStateList, otherProps);

  if (renderChild) {
    return (
      <Component highConfig={highConfig} {...otherProps} {...stateProps}>
        {renderChildren(highConfig)}
      </Component>
    );
  }

  return <Component highConfig={highConfig} {...otherProps} {...stateProps} />;
};
