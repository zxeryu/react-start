import React from "react";
import { TableDropdown } from "@ant-design/pro-table";
import { DropdownProps } from "@ant-design/pro-table/es/components/Dropdown";
import { HighProps, TOptions, useHighPage } from "@react-start/cheng-high";
import { map } from "lodash";

export interface HighTableDropdownProps extends Omit<DropdownProps, "menus">, HighProps {
  options?: TOptions;
}

export const HighTableDropdown = ({ highConfig, onSend, options, ...otherProps }: HighTableDropdownProps) => {
  const { sendEvent } = useHighPage();
  return (
    <TableDropdown
      {...otherProps}
      menus={map(options, (item) => ({ key: item.value as string, name: item.label }))}
      onSelect={(key: string) => {
        if (otherProps.onSelect) {
          otherProps.onSelect(key);
          return;
        }
        if (!highConfig?.sendEventName) {
          return;
        }
        if (onSend) {
          onSend({ type: highConfig.sendEventName, payload: { value: key } });
          return;
        }
        sendEvent({ type: highConfig.sendEventName });
      }}
    />
  );
};
