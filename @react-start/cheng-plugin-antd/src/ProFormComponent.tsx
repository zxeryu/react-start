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
  ProFormField,
  ProFormFieldProps,
} from "@ant-design/pro-form";
import { ComponentWrapper, HighProps } from "@react-start/cheng-high";

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

export interface HighFormGroupProps extends GroupProps, HighProps {}
export const HighFormGroup = (props: HighFormGroupProps) => (
  <ComponentWrapper Component={ProForm.Group} renderChild {...props} />
);

export interface HighFormItemProps extends ProFormItemProps, HighProps {}
export const HighFormItem = (props: HighFormItemProps) => (
  <ComponentWrapper Component={ProForm.Item} renderChild {...props} />
);

export interface HighFormTextProps extends ProFormFieldItemProps<InputProps>, HighProps {}
export const HighFormText = (props: HighFormTextProps) => <ComponentWrapper Component={ProFormText} {...props} />;

export interface HighFormPasswordProps extends ProFormFieldItemProps<PasswordProps>, HighProps {}
export const HighFormPassword = (props: HighFormPasswordProps) => (
  <ComponentWrapper Component={ProFormText.Password} {...props} />
);

export interface HighFormCaptchaProps extends ProFormCaptchaProps, HighProps {}
export const HighFormCaptcha = (props: HighFormCaptchaProps) => (
  <ComponentWrapper Component={ProFormCaptcha} {...props} />
);

export interface HighFormDigitProps extends ProFormDigitProps, HighProps {}
export const HighFormDigit = (props: HighFormDigitProps) => <ComponentWrapper Component={ProFormDigit} {...props} />;

export type HighFormDatePickerProps = ProFormFieldItemProps<DatePickerProps> & HighProps;
export const HighFormDatePicker = (props: HighFormDatePickerProps) => (
  <ComponentWrapper Component={ProFormDatePicker} {...props} />
);

export type HighFormDateRangePickerProps = ProFormFieldItemProps<RangePickerProps> & HighProps;
export const HighFormDateRangePicker = (props: HighFormDateRangePickerProps) => (
  <ComponentWrapper Component={ProFormDateRangePicker} {...props} />
);

export type HighFormTimePickerProps = ProFormFieldItemProps<DatePickerProps> & HighProps;
export const HighFormTimePicker = (props: HighFormTimePickerProps) => (
  <ComponentWrapper Component={ProFormTimePicker} {...props} />
);

export type HighFormTimeRangePickerProps = ProFormFieldItemProps<DatePickerProps> & HighProps;
export const HighFormTimeRangePicker = (props: HighFormTimeRangePickerProps) => (
  <ComponentWrapper Component={ProFormTimePicker.RangePicker} {...props} />
);

export interface HighFormDateTimePickerProps extends ProFormFieldItemProps<DatePickerProps>, HighProps {}
export const HighFormDateTimePicker = (props: HighFormDateTimePickerProps) => (
  <ComponentWrapper Component={ProFormDateTimePicker} {...props} />
);

export type HighFormDateTimeRangePickerProps = ProFormFieldItemProps<RangePickerProps> & HighProps;
export const HighFormDateTimeRangePicker = (props: HighFormDateTimeRangePickerProps) => (
  <ComponentWrapper Component={ProFormDateTimeRangePicker} {...props} />
);

export interface HighFormSelectProps extends ProFormSelectProps, HighProps {}
export const HighFormSelect = (props: HighFormSelectProps) => <ComponentWrapper Component={ProFormSelect} {...props} />;

export interface HighFormCheckboxProps extends ProFormCheckboxProps, HighProps {}
export const HighFormCheckbox = (props: HighFormCheckboxProps) => (
  <ComponentWrapper Component={ProFormCheckbox} {...props} />
);

export interface HighFormCheckboxGroupProps extends ProFormCheckboxGroupProps, HighProps {}
export const HighFormCheckboxGroup = (props: HighFormCheckboxGroupProps) => (
  <ComponentWrapper Component={ProFormCheckbox.Group} {...props} />
);

export interface HighFormRadioGroupProps extends ProFormRadioGroupProps, HighProps {}
export const HighFormRadioGroup = (props: HighFormRadioGroupProps) => (
  <ComponentWrapper Component={ProFormRadio.Group} {...props} />
);

export interface HighFormSwitchProps extends ProFormSwitchProps, HighProps {}
export const HighFormSwitch = (props: HighFormSwitchProps) => <ComponentWrapper Component={ProFormSwitch} {...props} />;

export const HighFormRate = (props: any) => <ComponentWrapper Component={ProFormRate} {...props} />;

export interface HighFormSliderProps extends ProFormSliderProps, HighProps {}
export const HighFormSlider = (props: HighFormSliderProps) => <ComponentWrapper Component={ProFormSlider} {...props} />;

export interface HighFormMoneyProps extends ProFormMoneyProps, HighProps {}
export const HighFormMoney = (props: HighFormMoneyProps) => <ComponentWrapper Component={ProFormMoney} {...props} />;

export interface HighProFormFieldProps extends ProFormFieldProps, HighProps {}
export const HighProFormField = (props: HighProFormFieldProps) => (
  <ComponentWrapper Component={ProFormField} {...props} />
);
