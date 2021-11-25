import React from "react";
import ProForm, {
  ProFormText,
  ProFormCaptcha,
  ProFormDigit,
  ProFormDatePicker,
  ProFormTimePicker,
  ProFormDateTimePicker,
  ProFormDateRangePicker,
  ProFormDateTimeRangePicker,
  ProFormSelect,
  ProFormCheckbox,
  ProFormRadio,
  ProFormSwitch,
  ProFormRate,
  ProFormSlider,
  ProFormMoney,
} from "@ant-design/pro-form";
import { ComponentWrapper, ComponentWrapperProps, HighProps } from "@react-start/cheng-high";

import { GroupProps } from "@ant-design/pro-form/es/interface";
import { ProFormItemProps } from "@ant-design/pro-form/es/components/FormItem";
import { ProFormFieldItemProps } from "@ant-design/pro-form/lib/interface";
import { DatePickerProps, InputProps } from "antd";
import { PasswordProps } from "antd/lib/input";
import { ProFormSelectProps } from "@ant-design/pro-form/es/components/Select";
import { ProFormCheckboxProps } from "@ant-design/pro-form/es/components/Checkbox";
import { ProFormCheckboxGroupProps } from "@ant-design/pro-form/lib/components/Checkbox";
import { ProFormRadioGroupProps } from "@ant-design/pro-form/es/components/Radio";
import { ProFormSwitchProps } from "@ant-design/pro-form/lib/components/Switch";
import { ProFormSliderProps } from "@ant-design/pro-form/es/components/Slider";
import { ProFormMoneyProps } from "@ant-design/pro-form/es/components/Money";
import { ProFormCaptchaProps } from "@ant-design/pro-form/es";
import { ProFormDigitProps } from "@ant-design/pro-form/es/components/Digit";
import { RangePickerProps } from "antd/lib/date-picker";
import { useFormContext } from "./ProForm";

import { isBoolean } from "lodash";

//处理readonly
const FormFieldWrapper = (props: ComponentWrapperProps) => {
  const { readonly } = useFormContext();
  return <ComponentWrapper noChild {...props} readonly={isBoolean(props.readonly) ? props.readonly : readonly} />;
};

export interface HighFormGroupProps extends GroupProps, HighProps {}
export const HighFormGroup = (props: HighFormGroupProps) => <ComponentWrapper Component={ProForm.Group} {...props} />;

export interface HighFormItemProps extends ProFormItemProps, HighProps {}
export const HighFormItem = (props: HighFormItemProps) => <ComponentWrapper Component={ProForm.Item} {...props} />;

export interface HighFormTextProps extends ProFormFieldItemProps<InputProps>, HighProps {}
export const HighFormText = (props: HighFormTextProps) => (
  <FormFieldWrapper Component={ProFormText} noChild {...props} />
);

export interface HighFormPasswordProps extends ProFormFieldItemProps<PasswordProps>, HighProps {}
export const HighFormPassword = (props: HighFormPasswordProps) => (
  <FormFieldWrapper Component={ProFormText.Password} noChild {...props} />
);

export interface HighFormCaptchaProps extends ProFormCaptchaProps, HighProps {}
export const HighFormCaptcha = (props: HighFormCaptchaProps) => (
  <FormFieldWrapper Component={ProFormCaptcha} noChild {...props} />
);

export interface HighFormDigitProps extends ProFormDigitProps, HighProps {}
export const HighFormDigit = (props: HighFormDigitProps) => (
  <FormFieldWrapper Component={ProFormDigit} noChild {...props} />
);

export type HighFormDatePickerProps = ProFormFieldItemProps<DatePickerProps> & HighProps;
export const HighFormDatePicker = (props: HighFormDatePickerProps) => (
  <FormFieldWrapper Component={ProFormDatePicker} noChild {...props} />
);

export type HighFormDateRangePickerProps = ProFormFieldItemProps<RangePickerProps> & HighProps;
export const HighFormDateRangePicker = (props: HighFormDateRangePickerProps) => (
  <FormFieldWrapper Component={ProFormDateRangePicker} noChild {...props} />
);

export type HighFormTimePickerProps = ProFormFieldItemProps<DatePickerProps> & HighProps;
export const HighFormTimePicker = (props: HighFormTimePickerProps) => (
  <FormFieldWrapper Component={ProFormTimePicker} {...props} />
);

export type HighFormTimeRangePickerProps = ProFormFieldItemProps<DatePickerProps> & HighProps;
export const HighFormTimeRangePicker = (props: HighFormTimeRangePickerProps) => (
  <FormFieldWrapper Component={ProFormTimePicker.RangePicker} noChild {...props} />
);

export interface HighFormDateTimePickerProps extends ProFormFieldItemProps<DatePickerProps>, HighProps {}
export const HighFormDateTimePicker = (props: HighFormDateTimePickerProps) => (
  <FormFieldWrapper Component={ProFormDateTimePicker} noChild {...props} />
);

export type HighFormDateTimeRangePickerProps = ProFormFieldItemProps<RangePickerProps> & HighProps;
export const HighFormDateTimeRangePicker = (props: HighFormDateTimeRangePickerProps) => (
  <FormFieldWrapper Component={ProFormDateTimeRangePicker} noChild {...props} />
);

export interface HighFormSelectProps extends ProFormSelectProps, HighProps {}
export const HighFormSelect = (props: HighFormSelectProps) => <FormFieldWrapper Component={ProFormSelect} {...props} />;

export interface HighFormCheckboxProps extends ProFormCheckboxProps, HighProps {}
export const HighFormCheckbox = (props: HighFormCheckboxProps) => (
  <FormFieldWrapper Component={ProFormCheckbox} noChild {...props} />
);

export interface HighFormCheckboxGroupProps extends ProFormCheckboxGroupProps, HighProps {}
export const HighFormCheckboxGroup = (props: HighFormCheckboxGroupProps) => (
  <FormFieldWrapper Component={ProFormCheckbox.Group} noChild {...props} />
);

export interface HighFormRadioGroupProps extends ProFormRadioGroupProps, HighProps {}
export const HighFormRadioGroup = (props: HighFormRadioGroupProps) => (
  <FormFieldWrapper Component={ProFormRadio.Group} noChild {...props} />
);

export interface HighFormSwitchProps extends ProFormSwitchProps, HighProps {}
export const HighFormSwitch = (props: HighFormSwitchProps) => (
  <FormFieldWrapper Component={ProFormSwitch} noChild {...props} />
);

export const HighFormRate = (props: any) => <FormFieldWrapper Component={ProFormRate} noChild {...props} />;

export interface HighFormSliderProps extends ProFormSliderProps, HighProps {}
export const HighFormSlider = (props: HighFormSliderProps) => (
  <FormFieldWrapper Component={ProFormSlider} noChild {...props} />
);

export interface HighFormMoneyProps extends ProFormMoneyProps, HighProps {}
export const HighFormMoney = (props: HighFormMoneyProps) => (
  <FormFieldWrapper Component={ProFormMoney} noChild {...props} />
);
