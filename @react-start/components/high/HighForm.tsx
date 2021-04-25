import React, { ForwardRefRenderFunction, FunctionComponent } from "react";
import { TextField, TextFieldProps, Button, ButtonTypeMap, Switch, SwitchProps } from "@material-ui/core";
import {
  CheckboxGroup,
  Form,
  FormItem,
  ICheckboxGroupProps,
  IFormItemProps,
  IFormProps,
  IRadioGroupProps,
  ISelectProps,
  RadioGroup,
  Select,
} from "../src";
import { map } from "lodash";

type ElementProps = {
  TextInput: TextFieldProps;
  SelectInput: ISelectProps;
  RadioGroup: IRadioGroupProps;
  CheckboxGroup: ICheckboxGroupProps;
  Button: ButtonTypeMap["props"];
  Switch: SwitchProps;
};

export type TElementType = keyof ElementProps;

const ElementMap: { [key in keyof ElementProps]: FunctionComponent | ForwardRefRenderFunction<any, any> } = {
  TextInput: TextField,
  SelectInput: Select,
  RadioGroup: RadioGroup,
  CheckboxGroup: CheckboxGroup,
  Button: Button,
  Switch: Switch,
};

interface IHighFormItem<T extends TElementType> {
  type: T;
  itemProps: Omit<IFormItemProps, "children">;
  elementProps?: ElementProps[T];
}

export interface IHighFormData {
  formProps?: IFormProps;
  items: IHighFormItem<TElementType>[];
}

export const HighForm = ({ data }: { data: IHighFormData }) => {
  return (
    <Form {...data.formProps}>
      {map(data.items, ({ type, itemProps, elementProps }) => {
        const Content = ElementMap[type as TElementType];
        if (!Content) {
          return null;
        }
        return (
          <FormItem key={itemProps?.name} {...itemProps}>
            <Content {...elementProps} />
          </FormItem>
        );
      })}
    </Form>
  );
};
