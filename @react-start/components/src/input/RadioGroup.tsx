import React, { ReactElement } from "react";
import { RadioGroup as RadioGroupOrigin, Radio, FormControlLabel, RadioGroupProps } from "@material-ui/core";
import { map } from "lodash";
import { TOptions } from "../type";

export interface IRadioGroupProps extends RadioGroupProps {
  options?: TOptions;
  control?: ReactElement;
}

export const RadioGroup = ({ options, children, control = <Radio />, ...groupProps }: IRadioGroupProps) => {
  return (
    <RadioGroupOrigin {...groupProps}>
      {map(options, (o) => (
        <FormControlLabel key={o.value} control={control} label={o.label} value={o.value} />
      ))}
      {children}
    </RadioGroupOrigin>
  );
};
