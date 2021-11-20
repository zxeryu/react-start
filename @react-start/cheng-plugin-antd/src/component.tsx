import { ButtonProps } from "antd/es";
import { HighProps, useHigh, ComponentWrapper, TRegisterEventItem } from "@react-start/cheng-high";
import { Button, Radio } from "antd";
import React from "react";

export interface HighButtonProps extends ButtonProps, HighProps {
  iconName?: string;
}

const HighButtonRegisterEvent: TRegisterEventItem[] = [
  {
    name: "onClick",
    transObjList: [{ key: "e", name: 0 }],
  },
];

export const HighButton = ({ iconName, ...otherProps }: HighButtonProps) => {
  const { getIcon } = useHigh();

  return (
    <ComponentWrapper
      Component={Button}
      icon={iconName ? getIcon(iconName) : otherProps.icon}
      registerEventList={HighButtonRegisterEvent}
      {...otherProps}
    />
  );
};

const HighRadioGroupRegisterEvent: TRegisterEventItem[] = [
  {
    name: "onChange",
    transObjList: [{ key: "value", name: "0.target.value" }],
  },
];

export const HighRadioGroup = (props: any) => {
  return <ComponentWrapper Component={Radio.Group} registerEventList={HighRadioGroupRegisterEvent} {...props} />;
};
