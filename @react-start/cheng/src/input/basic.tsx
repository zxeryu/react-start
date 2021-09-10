import { SetProp } from "../types";
import React, { useState } from "react";
import { Checkbox, FormControlLabel, MenuItem, TextField } from "@material-ui/core";
import { isNumber, map, isObject, get } from "lodash";
import { useSetProp } from "../OperatePanel";

export interface SetProps extends SetProp {
  propKey: string;
  value?: any;
}

export const BooleanSet = ({ name, propKey, value }: SetProps) => {
  const { setProp } = useSetProp();

  const [checked, setChecked] = useState<boolean>(value);

  return (
    <FormControlLabel
      checked={checked}
      control={<Checkbox />}
      label={name}
      onChange={(e) => {
        setProp(propKey, (e.target as any).checked);
        setChecked((e.target as any).checked);
      }}
    />
  );
};

export const NumberSet = ({ name, propKey, value }: SetProps) => {
  const { setProp } = useSetProp();

  return (
    <TextField
      size={"small"}
      type={"number"}
      label={name}
      // value={value}
      defaultValue={value}
      onChange={(e) => {
        setProp(propKey, e.target.value);
      }}
    />
  );
};

export const StringSet = ({ name, propKey, value, rows }: SetProps) => {
  const { setProp } = useSetProp();

  return (
    <TextField
      size={"small"}
      multiline={!!isNumber(rows)}
      rows={rows}
      label={name}
      // value={value}
      defaultValue={value}
      // onChange={(e) => {
      //   setProp(propKey, e.target.value);
      // }}
      onBlur={(e) => {
        setProp(propKey, e.target.value);
      }}
    />
  );
};

export const SelectSet = ({ name, propKey, value, chooseValue }: SetProps) => {
  const { setProp } = useSetProp();
  const [v, setV] = useState(value);

  return (
    <TextField
      size={"small"}
      select
      fullWidth
      label={name}
      value={v}
      onChange={(e) => {
        const v = e.target.value;
        setProp(propKey, v);
        setV(v);
      }}>
      {map(chooseValue, (item) => {
        const value = isObject(item) ? get(item, "value") : item;
        const label = isObject(item) ? get(item, "label") : item;
        return (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        );
      })}
    </TextField>
  );
};
