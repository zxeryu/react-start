import { HighButtonProps } from "./Button";
import { HighAProps } from "./components";
import { HighTableDropdownProps } from "./ProTableComponent";
import { HighEditTableProps, HighTableProps } from "./ProTable";
import { HighFormProps } from "./ProForm";
import {
  HighFormCaptchaProps,
  HighFormCheckboxGroupProps,
  HighFormCheckboxProps,
  HighFormDatePickerProps,
  HighFormDateTimePickerProps,
  HighFormDigitProps,
  HighFormGroupProps,
  HighFormItemProps,
  HighFormMoneyProps,
  HighFormPasswordProps,
  HighFormRadioGroupProps,
  HighFormSelectProps,
  HighFormSliderProps,
  HighFormSwitchProps,
  HighFormTextProps,
  HighProFormFieldProps,
} from "./ProFormComponent";
import { HighCardProps, HighPageContainerProps } from "./Layout";

export interface ElementMap {
  HighButton: HighButtonProps;
  HighA: HighAProps;
  //
  HighTable: HighTableProps;
  HighEditTable: HighEditTableProps;
  HighTableDropdown: HighTableDropdownProps;
  //
  HighForm: HighFormProps;
  HighSearchForm: HighFormProps;
  HighFormGroup: HighFormGroupProps;
  HighFormItem: HighFormItemProps;
  HighFormText: HighFormTextProps;
  HighFormPassword: HighFormPasswordProps;
  HighFormCaptcha: HighFormCaptchaProps;
  HighFormDigit: HighFormDigitProps;
  HighFormDatePicker: HighFormDatePickerProps;
  HighFormDateTimePicker: HighFormDateTimePickerProps;
  HighFormSelect: HighFormSelectProps;
  HighFormCheckbox: HighFormCheckboxProps;
  HighFormCheckboxGroup: HighFormCheckboxGroupProps;
  HighFormRadioGroup: HighFormRadioGroupProps;
  HighFormSwitch: HighFormSwitchProps;
  HighFormRate: any;
  HighFormSlider: HighFormSliderProps;
  HighFormMoney: HighFormMoneyProps;
  HighProFormField: HighProFormFieldProps;
  //
  HighPageContainer: HighPageContainerProps;
  HighCard: HighCardProps;
}

export interface ElementProp<T extends ElementMap, K extends keyof T> {
  elementType$: K;
  elementProps$: T[K];
  oid: string;
  elementList?: ElementProp<T, keyof T>;
}

//对应cheng中的OElementItem
export type ElementProps = ElementProp<ElementMap, keyof ElementMap>;

export type ElementListProps = ElementProps[];
