import React, { AnchorHTMLAttributes } from "react";
import { HighProps, useHighPage, withoutBubble } from "@react-start/cheng-high";

export interface HighAProps extends AnchorHTMLAttributes<HTMLAnchorElement>, HighProps {}

export const HighA = ({ highConfig, onSend, ...otherProps }: HighAProps) => {
  const { getStateValues, sendEvent } = useHighPage();
  return (
    <a
      {...otherProps}
      {...getStateValues(highConfig?.receiveStateList)}
      onClick={withoutBubble((e: any) => {
        if (otherProps.onClick) {
          otherProps.onClick(e);
          return;
        }
        if (onSend && highConfig?.sendEventName) {
          onSend({ type: highConfig.sendEventName });
          return;
        }
        if (highConfig?.sendEventName) {
          sendEvent({ type: highConfig.sendEventName });
        }
      })}
    />
  );
};
