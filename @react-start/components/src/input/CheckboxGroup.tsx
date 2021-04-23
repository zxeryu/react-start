import { FormGroup, Checkbox, FormControlLabel } from "@material-ui/core";
import React, { ReactElement, useCallback, useRef } from "react";
import { map, indexOf, filter } from "lodash";
import { TOptions, TValue } from "../type";

export const CheckboxGroup = ({
  row,
  options,
  control = <Checkbox />,
  value,
  onChange,
}: {
  row?: boolean;
  options: TOptions;
  control?: ReactElement;
  value?: TValue[];
  onChange?: (e: TValue[]) => void;
}) => {
  //无状态下存储
  const valueRef = useRef<TValue[]>([]);

  const getValue = useCallback(
    (v: TValue) => {
      if (!value) {
        return undefined;
      }
      return indexOf(value, v) > -1;
    },
    [value],
  );

  return (
    <FormGroup row={row}>
      {map(options || [], (o) => (
        <FormControlLabel
          key={o.value}
          control={control}
          label={o.label}
          value={o.value}
          checked={getValue(o.value)}
          onChange={(_, checked) => {
            if (!onChange) return;
            if (!value) {
              valueRef.current = checked
                ? [...valueRef.current, o.value]
                : filter(valueRef.current, (v) => v !== o.value);

              onChange(valueRef.current);
              return;
            }

            if (checked) {
              onChange([...value, o.value]);
            } else {
              onChange(filter(value, (v) => v !== o.value));
            }
          }}
        />
      ))}
    </FormGroup>
  );
};
