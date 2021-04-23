import SelectOrigin, { SelectProps } from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React from "react";
import { TOptions } from "../type";
import { map } from "lodash";

export const Select = ({ options, ...otherProps }: SelectProps & { options?: TOptions }) => {
  return (
    <SelectOrigin
      MenuProps={{
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "left",
        },
        getContentAnchorEl: null,
      }}
      IconComponent={ExpandMoreIcon}
      {...otherProps}>
      {map(options, (option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </SelectOrigin>
  );
};
