import React from "react";
import { TableDropdown } from "@ant-design/pro-table";
import { DropdownProps } from "@ant-design/pro-table/es/components/Dropdown";
import { HighProps, TOptions, TRegisterEventItem, ComponentWrapper } from "@react-start/cheng-high";
import { map } from "lodash";

export interface HighTableDropdownProps extends Omit<DropdownProps, "menus">, HighProps {
  options?: TOptions;
}

const HighTableDropdownRegisterEvent: TRegisterEventItem[] = [
  {
    name: "onSelect",
    transObjList: [{ key: "value", name: 0 }],
  },
];

export const HighTableDropdown = ({ highConfig, onSend, options, ...otherProps }: HighTableDropdownProps) => {
  return (
    <ComponentWrapper
      Component={TableDropdown}
      menus={map(options, (item) => ({ key: item.value as string, name: item.label }))}
      registerEventList={HighTableDropdownRegisterEvent}
      noChild
      {...otherProps}
    />
  );
};
