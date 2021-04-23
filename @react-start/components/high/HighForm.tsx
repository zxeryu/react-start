import React, { FunctionComponent } from "react";
import { TextField, TextFieldProps } from "@material-ui/core";
import { Form, FormItem, IFormItemProps, IFormProps, ISelectProps, Select } from "../src";
import { map } from "lodash";

type ElementProps = {
  TextInput: TextFieldProps;
  SelectInput: ISelectProps;
};

export type TElementType = keyof ElementProps;

const ElementMap: { [key in keyof ElementProps]: FunctionComponent } = {
  TextInput: TextField,
  SelectInput: Select,
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
