import React from "react";
import { HighProvider, HighA, HighSpan } from "@react-start/cheng-high";
import {
  HighButton,
  HighTable,
  HighTableDropdown,
  HighForm,
  HighModalForm,
  HighDrawerForm,
  HighSearchForm as HighSearchFormOrigin,
  HighSearchFormProps,
  HighFormList,
  HighFormGroup,
  HighFormItem,
  HighFormText,
  HighFormSelect,
  HighFormDigit,
  HighFormDatePicker,
  HighFormCheckboxGroup,
  HighFormRadioGroup,
  HighFormSwitch,
  HighFormMoney,
  HighPageContainer,
  HighEditTable,
  HighFormEditTableItem,
  HighCURD as HighCURDOrigin,
} from "@react-start/cheng-plugin-antd";
import { List } from "./List";

import "antd/dist/antd.css";
import "@ant-design/pro-form/dist/form.css";
import "@ant-design/pro-table/dist/table.css";
import "@ant-design/pro-layout/dist/layout.css";
import { Store, StoreProvider } from "@reactorx/core";
import { RequestProvider } from "@react-start/request";
import { searchApi } from "./RequestDemo";

const HighSearchForm = (props: HighSearchFormProps) => {
  return <HighSearchFormOrigin css={{ "> *": { paddingBottom: 10 } }} {...props} />;
};

const TypeMap = {
  text: "HighFormText",
  select: "HighFormSelect",
  date: "HighFormDatePicker",
};

const HighCURD = (props: any) => {
  return <HighCURDOrigin elementTypeMap={TypeMap} {...props} />;
};

const ElementMap = {
  HighButton,
  HighTable,
  HighA,
  HighSpan,
  HighTableDropdown,
  HighForm,
  HighFormItem,
  HighModalForm,
  HighDrawerForm,
  HighSearchForm,
  HighFormList,
  HighFormGroup,
  HighFormText,
  HighFormSelect,
  HighFormDigit,
  HighFormDatePicker,
  HighFormCheckboxGroup,
  HighFormRadioGroup,
  HighFormSwitch,
  HighFormMoney,
  HighPageContainer,
  HighEditTable,
  HighFormEditTableItem,
  HighCURD,
};

const requestActorList = [{ ...searchApi, req: { q: "rxjs" }, extra: { stateName: "meta-test" } }];

const store$ = Store.create({});

export const AntdDemo = () => {
  return (
    <StoreProvider value={store$}>
      <RequestProvider>
        <HighProvider elementsMap={ElementMap} requestActorList={requestActorList}>
          <List />
          {/*<RequestDemo />*/}
        </HighProvider>
      </RequestProvider>
    </StoreProvider>
  );
};
