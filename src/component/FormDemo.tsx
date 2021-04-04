import React from "react";
import { FormControl, FormControlLabel, FormHelperText, FormGroup, Checkbox, Switch, Input } from "@material-ui/core";

export const FormDemo = () => {
  return (
    <div>
      <div>FormDemo</div>

      <FormControl error>
        <FormGroup row>
          <FormControlLabel control={<Checkbox name="gilad" />} label="Gilad Gray" />
          <FormControlLabel control={<Checkbox name="jason" />} label="Jason Killian" />
          <FormControlLabel control={<Checkbox name="antoine" />} label="Antoine Llorca" />
        </FormGroup>
        <FormHelperText>Be careful</FormHelperText>
      </FormControl>

      <div>
        <FormControl>
          <FormControlLabel
            onChange={(_, checked) => {
              console.log("@@@@@@@@@", checked);
            }}
            control={<Switch />}
            label="switch"
          />
        </FormControl>
      </div>
      <div>
        <FormControl>
          <Input />
        </FormControl>
      </div>
    </div>
  );
};
