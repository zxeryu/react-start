import React from "react";
import ProForm from "@ant-design/pro-form";
import { GroupProps } from "@ant-design/pro-form/es/interface";
import { HighProps, useHigh } from "@react-start/cheng-high";
import { get } from "lodash";

export interface HighFormGroupProps extends GroupProps, HighProps {}

export const HighFormGroup = ({ highConfig, ...otherProps }: HighFormGroupProps) => {
  const { renderElementList } = useHigh();
  return (
    <ProForm.Group {...otherProps}>
      {renderElementList(get(highConfig, ["highInject", "elementList"], []))}
    </ProForm.Group>
  );
};
