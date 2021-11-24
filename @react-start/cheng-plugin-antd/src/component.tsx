import { ButtonProps } from "antd/es";
import { HighProps, useHigh, ComponentWrapper, TRegisterEventItem } from "@react-start/cheng-high";
import { Button, Radio, Modal, ModalProps } from "antd";
import React from "react";

export interface HighButtonProps extends ButtonProps, HighProps {
  iconName?: string;
}

const ButtonRegisterEvent: TRegisterEventItem[] = [
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
      registerEventList={ButtonRegisterEvent}
      {...otherProps}
    />
  );
};

const RadioGroupRegisterEvent: TRegisterEventItem[] = [
  {
    name: "onChange",
    transObjList: [{ key: "value", name: "0.target.value" }],
  },
];

export const HighRadioGroup = (props: any) => {
  return <ComponentWrapper Component={Radio.Group} registerEventList={RadioGroupRegisterEvent} {...props} />;
};

export const HighModal = (props: ModalProps & HighProps) => {
  return <ComponentWrapper Component={Modal} {...props} />;
};
