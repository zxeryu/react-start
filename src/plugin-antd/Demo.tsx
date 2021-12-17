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
  HighCURD,
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

const requestActorMap = {
  [searchApi.name]: searchApi,
};

const metaList = [
  {
    requestName: "search",
    initialParams: { q: "rxjs" },
    storeName: "meta-test",
  },
];

const store$ = Store.create({});

export const AntdDemo = () => {
  return (
    <StoreProvider value={store$}>
      <RequestProvider>
        <HighProvider elementsMap={ElementMap} requestActorMap={requestActorMap} metaList={metaList}>
          <List />
          {/*<RequestDemo />*/}
        </HighProvider>
      </RequestProvider>
    </StoreProvider>
  );
};
