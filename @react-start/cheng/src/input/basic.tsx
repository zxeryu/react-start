import { SetProp } from "../types";
import React, { useRef, useState } from "react";
import { Checkbox, MenuItem, TextField, FormControlLabel, InputAdornment, IconButton } from "@material-ui/core";
import { Close, ArrowDropDown } from "@material-ui/icons";
import { isNumber, map, isObject, get } from "lodash";
import { useSetProp } from "../OperatePanel";
import { useHover } from "@react-start/hooks";

export interface SetProps extends SetProp {
  propKey: string;
  value?: any;
}

export const BooleanSet = ({ name, propKey, value }: SetProps) => {
  const { setProp } = useSetProp();

  const [checked, setChecked] = useState<boolean>(value);

  return (
    <FormControlLabel
      style={{ marginLeft: 0 }}
      checked={checked}
      control={<Checkbox style={{ padding: 2 }} />}
      label={name}
      onChange={(e) => {
        const checked = get(e.target, "checked");
        setProp(propKey, checked);
        setChecked(checked);
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

  const ref = useRef<any>();
  const isHovering = useHover(ref);

  return (
    <TextField
      ref={ref}
      size={"small"}
      select
      fullWidth
      label={name}
      value={v}
      onChange={(e) => {
        const v = e.target.value;
        setProp(propKey, v);
        setV(v);
      }}
      SelectProps={{
        IconComponent: null as any,
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position={"end"}>
            {v && isHovering ? (
              <IconButton
                style={{ padding: 2 }}
                onClick={() => {
                  setProp(propKey, undefined);
                  setV(undefined);
                }}>
                <Close fontSize={"small"} />
              </IconButton>
            ) : (
              <ArrowDropDown />
            )}
          </InputAdornment>
        ),
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
