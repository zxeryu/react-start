import React, { AnchorHTMLAttributes, useCallback } from "react";
import { HighProps, useHighPage, withoutBubble } from "@react-start/cheng-high";

export interface HighAProps extends AnchorHTMLAttributes<HTMLAnchorElement>, HighProps {
  bubble?: boolean;
}

export const HighA = ({ highConfig, onSend, bubble = true, ...otherProps }: HighAProps) => {
  const { getStateValues, sendEvent } = useHighPage();

  const handleClick = useCallback((e: any) => {
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
  }, []);

  return (
    <a
      {...otherProps}
      {...getStateValues(highConfig?.receiveStateList)}
      onClick={bubble ? handleClick : withoutBubble(handleClick)}
    />
  );
};
