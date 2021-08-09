import React, { ForwardRefRenderFunction, FunctionComponent } from "react";
import {
  HighForm,
  IHighFormData,
  CheckboxGroup,
  ICheckboxGroupProps,
  IRadioGroupProps,
  ISelectProps,
  RadioGroup,
  Select,
  HighProvider,
} from "@react-start/components";
import { Button, ButtonTypeMap, Switch, SwitchProps, TextField, TextFieldProps } from "@material-ui/core";

type ElementProps = {
  TextInput: TextFieldProps;
  SelectInput: ISelectProps;
  RadioGroup: IRadioGroupProps;
  CheckboxGroup: ICheckboxGroupProps;
  Button: ButtonTypeMap["props"];
  Switch: SwitchProps;
};

const ElementMap: { [key in keyof ElementProps]: FunctionComponent | ForwardRefRenderFunction<any, any> } = {
  TextInput: TextField,
  SelectInput: Select,
  RadioGroup: RadioGroup,
  CheckboxGroup: CheckboxGroup,
  Button: Button,
  Switch: Switch,
};

const options = [
  { label: "选择一", value: "1" },
  { label: "选择二", value: "2" },
  { label: "选择三", value: "3" },
];

const structureData: IHighFormData = {
  formProps: {
    mode: "horizontal",
    labelStyle: { width: "20%", textAlign: "right" },
    inputStyle: { width: "50%" },
    initialValues: { selectMulti: [] },
    onSubmit: (values) => {
      console.log("@@@@@@", values);
    },
  },
  items: [
    { type: "TextInput", itemProps: { name: "text", label: "Text" }, elementProps: { placeholder: "请输入" } },
    {
      type: "TextInput",
      itemProps: { name: "textMulti", label: "MultiText" },
      elementProps: { placeholder: "请输入", rows: 3, multiline: true },
    },
    {
      type: "TextInput",
      itemProps: { name: "password", label: "Password" },
      elementProps: { type: "password" },
    },
    {
      type: "TextInput",
      itemProps: { name: "number", label: "Number" },
      elementProps: { type: "number" },
    },
    {
      type: "SelectInput",
      itemProps: { name: "select", label: "Select" },
      elementProps: { options },
    },
    {
      type: "SelectInput",
      itemProps: { name: "selectMulti", label: "SelectMulti" },
      elementProps: { options, multiple: true },
    },
    {
      type: "RadioGroup",
      itemProps: { name: "radioGroup", label: "RadioGroup" },
      elementProps: { options, row: true },
    },
    {
      type: "CheckboxGroup",
      itemProps: { name: "checkboxGroup", label: "CheckboxGroup", directChange: true },
      elementProps: { options, row: true },
    },
    {
      type: "Switch",
      itemProps: { name: "switch", label: "Switch" },
      elementProps: {},
    },
    {
      type: "Button",
      itemProps: {},
      elementProps: {
        type: "submit",
        children: "submit",
        color: "primary",
        variant: "contained",
        fullWidth: true,
      } as any,
    },
  ],
};

// options={[
//     { label: "horizontal", value: "1" },
// { label: "vertical", value: "2" },
// { label: "inline", value: "3" },
// ]}

export const FormHighDemo = () => {
  return (
    <HighProvider elementsMap={ElementMap}>
      <div>
        FormHighDemo
        <HighForm data={structureData} />
      </div>
    </HighProvider>
  );
};
