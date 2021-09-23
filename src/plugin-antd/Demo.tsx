import React from "react";
import { HighProvider } from "@react-start/cheng-high";
import {
  HighButton,
  HighTable,
  HighA,
  HighTableDropdown,
  HighForm,
  HighSearchForm as HighSearchFormOrigin,
  HighSearchFormProps,
  HighFormText,
  HighFormSelect,
  HighFormDigit,
  HighFormDatePicker,
  HighFormCheckboxGroup,
  HighFormRadioGroup,
  HighFormSwitch,
  HighFormMoney,
  HighPageContainer,
} from "@react-start/cheng-plugin-antd";
import { List } from "./List";

import "antd/dist/antd.css";
import "@ant-design/pro-form/dist/form.css";
import "@ant-design/pro-table/dist/table.css";
import "@ant-design/pro-layout/dist/layout.css";

const HighSearchForm = (props: HighSearchFormProps) => {
  return <HighSearchFormOrigin css={{ "> *": { paddingBottom: 10 } }} {...props} />;
};

const ElementMap = {
  HighButton,
  HighTable,
  HighA,
  HighTableDropdown,
  HighForm,
  HighSearchForm,
  HighFormText,
  HighFormSelect,
  HighFormDigit,
  HighFormDatePicker,
  HighFormCheckboxGroup,
  HighFormRadioGroup,
  HighFormSwitch,
  HighFormMoney,
  HighPageContainer,
};

export const AntdDemo = () => {
  return (
    <HighProvider elementsMap={ElementMap}>
      <List />
    </HighProvider>
  );
};
