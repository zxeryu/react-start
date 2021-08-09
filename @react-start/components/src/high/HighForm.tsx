import React from "react";
import { Form, FormItem, IFormItemProps, IFormProps } from "../form";
import { map, get } from "lodash";
import { useHigh } from "./HighProvider";

interface IHighFormItem {
  type: string;
  itemProps: Omit<IFormItemProps, "children">;
  elementProps?: { [key: string]: any };
}

export interface IHighFormData {
  formProps?: IFormProps;
  items: IHighFormItem[];
}

export const HighForm = ({ data }: { data: IHighFormData }) => {
  const { elementsMap } = useHigh();

  return (
    <Form {...data.formProps}>
      {map(data.items, ({ type, itemProps, elementProps }, index) => {
        const Content = get(elementsMap, type);
        if (!Content) {
          return null;
        }
        return (
          <FormItem key={itemProps?.name || index} {...itemProps}>
            <Content {...elementProps} />
          </FormItem>
        );
      })}
    </Form>
  );
};
