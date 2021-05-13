import { Select as SelectOrigin, SelectProps, MenuItem } from "@material-ui/core";
import React from "react";
import { TOptions } from "../type";
import { map } from "lodash";

export interface ISelectProps extends SelectProps {
  options?: TOptions;
}

export const Select = ({ options, ...otherProps }: ISelectProps) => {
  return (
    <SelectOrigin
      MenuProps={{
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "left",
        },
      }}
      {...otherProps}>
      {map(options, (option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </SelectOrigin>
  );
};
