import React, { ForwardRefRenderFunction, FunctionComponent } from "react";
import { HighForm, IHighFormData, CheckboxGroup, RadioGroup, Select, HighProvider } from "@react-start/components";
import { Button, Switch, TextField } from "@material-ui/core";
import * as yup from "yup";
import { ElementDescProps } from "../../@react-start/components/src/high/types";
import { HighLayout } from "../../@react-start/components/src/high/HighLayout";

const ElementMap: { [key: string]: FunctionComponent | ForwardRefRenderFunction<any, any> } = {
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

const FormConfigData: IHighFormData = {
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
    {
      type: "TextInput",
      itemProps: {
        name: "text",
        label: "Text",
        schema: yup.string().required("Text is required"),
      },
      elementProps: { placeholder: "请输入" },
    },
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
      id: "submit",
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

const ButtonConfigData: ElementDescProps = {
  id: "button",
  type: "Button",
  elementProps: { variant: "contained", children: "演示" },
};

const TextInputConfigData: ElementDescProps = {
  id: "textInput",
  type: "TextInput",
  elementProps: { placeholder: "演示" },
};

export const HighDemo = () => {
  return (
    <HighProvider elementsMap={ElementMap}>
      <div>
        HighForm
        <HighForm data={FormConfigData} />
        HighLayout
        <HighLayout
          data={{
            elementProps: { direction: "row", spacing: 1 },
            elementList: [ButtonConfigData, TextInputConfigData],
          }}
        />
      </div>
    </HighProvider>
  );
};
