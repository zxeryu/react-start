import React, { AnchorHTMLAttributes } from "react";
import { HighConfig, useHighPage, withoutBubble } from "@react-start/cheng-high";

export interface HighAProps extends AnchorHTMLAttributes<HTMLAnchorElement>, HighConfig {}

export const HighA = ({ highConfig, ...otherProps }: HighAProps) => {
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
        if (highConfig?.onSend && highConfig?.sendEventName) {
          highConfig.onSend({ type: highConfig.sendEventName });
          return;
        }
        if (highConfig?.sendEventName) {
          sendEvent({ type: highConfig.sendEventName });
        }
      })}
    />
  );
};
