import { ButtonProps } from "antd/es";
import { HighProps, useHigh, useHighPage, ComponentWrapper } from "@react-start/cheng-high";
import { Button, Radio, RadioChangeEvent } from "antd";
import React, { useCallback } from "react";

export interface HighButtonProps extends ButtonProps, HighProps {
  iconName?: string;
}

export const HighButton = ({ iconName, ...otherProps }: HighButtonProps) => {
  const { getIcon } = useHigh();
  const { sendEventSimple } = useHighPage();

  const handleClick = useCallback(() => {
    sendEventSimple(otherProps.highConfig, otherProps.onSend);
  }, []);

  return (
    <ComponentWrapper
      Component={Button}
      icon={iconName ? getIcon(iconName) : otherProps.icon}
      onClick={handleClick}
      {...otherProps}
    />
  );
};

export const HighRadioGroup = (props: any) => {
  const { sendEventSimple } = useHighPage();
  const handleChange = useCallback((e: RadioChangeEvent) => {
    sendEventSimple(props.highConfig, props.onSend, { payload: { value: e.target.value } });
  }, []);
  return <ComponentWrapper Component={Radio.Group} onChange={handleChange} {...props} />;
};
