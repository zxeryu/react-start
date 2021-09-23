import React, { useMemo } from "react";
import ProForm, {
  ProFormText,
  ProFormCaptcha,
  ProFormDigit,
  ProFormDatePicker,
  ProFormDateTimePicker,
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
import { GroupProps } from "@ant-design/pro-form/es/interface";
import { HighProps, useHigh, ElementConfigBase, useHighPage } from "@react-start/cheng-high";
import { get, head } from "lodash";
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

export interface HighFormGroupProps extends GroupProps, HighProps {}

export const HighFormGroup = ({ highConfig, ...otherProps }: HighFormGroupProps) => {
  const { renderElementList } = useHigh();
  return (
    <ProForm.Group {...otherProps}>
      {renderElementList(get(highConfig, ["highInject", "elementList"], []))}
    </ProForm.Group>
  );
};

export interface HighFormItemProps extends ProFormItemProps, HighProps {}

export const HighFormItem = ({ highConfig, ...otherProps }: HighFormItemProps) => {
  const { renderElement } = useHigh();

  const c: ElementConfigBase | undefined = useMemo(
    () => head(highConfig?.highInject?.elementList as any),
    [highConfig?.highInject?.elementList],
  );

  return <ProForm.Item {...otherProps}>{c ? renderElement(c) : null}</ProForm.Item>;
};

export interface HighFormTextProps extends ProFormFieldItemProps<InputProps>, HighProps {}

export const HighFormText = ({ highConfig, ...otherProps }: HighFormTextProps) => {
  const { getStateValues } = useHighPage();
  return <ProFormText {...otherProps} {...getStateValues(highConfig?.receiveStateList, otherProps)} />;
};

export interface HighFormPasswordProps extends ProFormFieldItemProps<PasswordProps>, HighProps {}

export const HighFormPassword = ({ highConfig, ...otherProps }: HighFormPasswordProps) => {
  const { getStateValues } = useHighPage();
  return <ProFormText.Password {...otherProps} {...getStateValues(highConfig?.receiveStateList, otherProps)} />;
};

export interface HighFormCaptchaProps extends ProFormCaptchaProps, HighProps {}

export const HighFormCaptcha = ({ highConfig, ...otherProps }: HighFormCaptchaProps) => {
  const { getStateValues } = useHighPage();
  return <ProFormCaptcha {...otherProps} {...getStateValues(highConfig?.receiveStateList, otherProps)} />;
};

export interface HighFormDigitProps extends ProFormDigitProps, HighProps {}

export const HighFormDigit = ({ highConfig, ...otherProps }: HighFormDigitProps) => {
  const { getStateValues } = useHighPage();
  return <ProFormDigit {...otherProps} {...getStateValues(highConfig?.receiveStateList, otherProps)} />;
};

export type HighFormDatePickerProps = DatePickerProps & HighProps;

export const HighFormDatePicker = ({ highConfig, ...otherProps }: HighFormDatePickerProps) => {
  const { getStateValues } = useHighPage();
  return <ProFormDatePicker {...otherProps} {...getStateValues(highConfig?.receiveStateList, otherProps)} />;
};

export interface HighFormDateTimePickerProps extends ProFormFieldItemProps<DatePickerProps>, HighProps {}

export const HighFormDateTimePicker = ({ highConfig, ...otherProps }: HighFormDateTimePickerProps) => {
  const { getStateValues } = useHighPage();
  return <ProFormDateTimePicker {...otherProps} {...getStateValues(highConfig?.receiveStateList, otherProps)} />;
};

export interface HighFormSelectProps extends ProFormSelectProps, HighProps {}

export const HighFormSelect = ({ highConfig, ...otherProps }: HighFormSelectProps) => {
  const { getStateValues } = useHighPage();
  return <ProFormSelect {...otherProps} {...getStateValues(highConfig?.receiveStateList, otherProps)} />;
};

export interface HighFormCheckboxProps extends ProFormCheckboxProps, HighProps {}

export const HighFormCheckbox = ({ highConfig, ...otherProps }: HighFormCheckboxProps) => {
  const { getStateValues } = useHighPage();
  return <ProFormCheckbox {...otherProps} {...getStateValues(highConfig?.receiveStateList, otherProps)} />;
};

export interface HighFormCheckboxGroupProps extends ProFormCheckboxGroupProps, HighProps {}

export const HighFormCheckboxGroup = ({ highConfig, ...otherProps }: HighFormCheckboxGroupProps) => {
  const { getStateValues } = useHighPage();
  return <ProFormCheckbox.Group {...otherProps} {...getStateValues(highConfig?.receiveStateList, otherProps)} />;
};

export interface HighFormRadioGroupProps extends ProFormRadioGroupProps, HighProps {}

export const HighFormRadioGroup = ({ highConfig, ...otherProps }: HighFormRadioGroupProps) => {
  const { getStateValues } = useHighPage();
  return <ProFormRadio.Group {...otherProps} {...getStateValues(highConfig?.receiveStateList, otherProps)} />;
};

export interface HighFormSwitchProps extends ProFormSwitchProps, HighProps {}

export const HighFormSwitch = ({ highConfig, ...otherProps }: HighFormSwitchProps) => {
  const { getStateValues } = useHighPage();
  return <ProFormSwitch {...otherProps} {...getStateValues(highConfig?.receiveStateList, otherProps)} />;
};

export const HighFormRate = ({ highConfig, ...otherProps }: any) => {
  const { getStateValues } = useHighPage();
  return <ProFormRate {...otherProps} {...getStateValues(highConfig?.receiveStateList, otherProps)} />;
};

export interface HighFormSliderProps extends ProFormSliderProps, HighProps {}

export const HighFormSlider = ({ highConfig, ...otherProps }: HighFormSliderProps) => {
  const { getStateValues } = useHighPage();
  return <ProFormSlider {...otherProps} {...getStateValues(highConfig?.receiveStateList, otherProps)} />;
};

export interface HighFormMoneyProps extends ProFormMoneyProps, HighProps {}

export const HighFormMoney = ({ highConfig, ...otherProps }: HighFormMoneyProps) => {
  const { getStateValues } = useHighPage();
  return <ProFormMoney {...otherProps} {...getStateValues(highConfig?.receiveStateList, otherProps)} />;
};

export interface HighProFormFieldProps extends ProFormFieldProps, HighProps {}

export const HighProFormField = ({ highConfig, ...otherProps }: HighProFormFieldProps) => {
  const { getStateValues } = useHighPage();
  return <ProFormField {...otherProps} {...getStateValues(highConfig?.receiveStateList, otherProps)} />;
};
