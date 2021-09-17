import React from "react";
import { Button } from "antd";
import { ButtonProps } from "antd/es";
import { useHigh, useHighPage, HighEvent } from "@react-start/cheng-high";

export interface HighButtonProps extends ButtonProps, HighEvent {
  iconName?: string;
}

export const HighButton = ({ sendEventName, receiveStateList, iconName, ...otherProps }: HighButtonProps) => {
  const { getIcon } = useHigh();
  const { getStateValues, sendEvent } = useHighPage();

  return (
    <Button
      {...otherProps}
      icon={iconName ? getIcon(iconName) : otherProps.icon}
      {...getStateValues(receiveStateList)}
      onClick={(e) => {
        if (sendEventName) {
          sendEvent({ type: sendEventName });
        }
        otherProps.onClick && otherProps.onClick(e);
      }}
    />
  );
};
