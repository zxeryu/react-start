import React from "react";
import { Form, FormItem, IFormItemProps, IFormProps } from "../form";
import { map, get } from "lodash";
import { useHigh } from "./HighProvider";
import { ElementDescProps } from "./types";

interface IHighFormItem extends ElementDescProps {
  itemProps: Omit<IFormItemProps, "children">;
}

export interface IHighFormData {
  formProps?: IFormProps;
  items: IHighFormItem[];
}

export const HighForm = ({ data }: { data: IHighFormData }) => {
  const { elementsMap } = useHigh();

  return (
    <Form {...data.formProps}>
      {map(data.items, ({ id, type, itemProps, elementProps }) => {
        const Content = get(elementsMap, type);
        if (!Content) {
          return null;
        }
        return (
          <FormItem key={itemProps?.name || id} {...itemProps}>
            <Content {...elementProps} />
          </FormItem>
        );
      })}
    </Form>
  );
};
