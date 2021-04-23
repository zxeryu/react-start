import { Form, FormItem, IFormItemProps, IFormProps, useForm } from "./Form";
import React, { isValidElement, useCallback, useRef } from "react";
import { debounce, size, map, isArray, get } from "lodash";
import { Values } from "./BaseForm";
import { shallowEqual } from "../util";
import { useNextEffect } from "@react-start/hooks";

export interface ISearchFormProps extends IFormProps {
  state?: any;
  setFilter?: (_: any) => void;
  debounceKeys?: string[];
  debounceTime?: number;
}

const Change = ({
  setFilter,
  debounceKeys,
  debounceTime = 500,
}: {
  setFilter?: (_: any) => void;
  debounceKeys?: string[];
  debounceTime?: number;
}) => {
  const { form } = useForm();
  const prevValueRef = useRef<Values>();

  const debounceSetValues = useCallback(
    debounce((values: Values) => {
      if (!setFilter) {
        return;
      }
      setFilter(values);
    }, debounceTime),
    [],
  );

  useNextEffect(() => {
    if (!setFilter) {
      return;
    }
    //直接触发
    if (!prevValueRef.current || !debounceKeys || size(debounceKeys) <= 0) {
      setFilter(form.values);
      //
      prevValueRef.current = form.values;
      return;
    }
    //判断debounceKeys匹配
    let isDebounce = false;
    for (let i = 0; i < debounceKeys.length; i++) {
      const debounceKey = debounceKeys[i];
      if (!shallowEqual(form.values[debounceKey], prevValueRef.current[debounceKey])) {
        isDebounce = true;
        break;
      }
    }
    if (isDebounce) {
      debounceSetValues(form.values);
    } else {
      setFilter(form.values);
    }
    //
    prevValueRef.current = form.values;
  }, [form.values]);

  return null;
};

export const SearchForm = ({ setFilter, debounceKeys, debounceTime, children, ...otherProps }: ISearchFormProps) => {
  return (
    <Form mode={"inline"} {...otherProps}>
      <Change setFilter={setFilter} debounceKeys={debounceKeys} debounceTime={debounceTime} />
      {children}
    </Form>
  );
};
/**
 * prepare FormItem
 * item element support props：data-form：{label?:string;directChange?:boolean}
 */
export const SimpleSearchForm = ({ children, ...otherProps }: ISearchFormProps) => {
  return (
    <SearchForm {...otherProps}>
      {map(isArray(children) ? children : [children], (item, index) => {
        if (!item) {
          return null;
        }
        if (!isValidElement(item)) {
          return <>{children}</>;
        }

        const dataForm: Omit<IFormItemProps, "children"> = get(item, ["props", "data-form"]);

        return (
          <FormItem
            key={item.key}
            name={(item.key || index) as any}
            label={dataForm?.label}
            directChange={dataForm?.directChange}>
            {item}
          </FormItem>
        );
      })}
    </SearchForm>
  );
};
