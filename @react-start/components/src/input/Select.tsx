import { Select as SelectOrigin, SelectProps, MenuItem, MenuItemProps } from "@material-ui/core";
import React from "react";
import { TOptions } from "../type";
import { map } from "lodash";

export interface ISelectProps extends SelectProps {
  options?: TOptions;
  MenuItemProps?: MenuItemProps;
}

export const Select = ({ options, MenuItemProps, ...otherProps }: ISelectProps) => {
  return (
    <SelectOrigin {...otherProps}>
      {map(options, (option) => (
        <MenuItem key={option.value} value={option.value} {...MenuItemProps}>
          {option.label}
        </MenuItem>
      ))}
    </SelectOrigin>
  );
};
