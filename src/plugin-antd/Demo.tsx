import React from "react";
import { HighProvider, HighA, HighSpan } from "@react-start/cheng-high";
import {
  HighButton,
  HighTable,
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

const metaList = [
  {
    requestActor: searchApi,
    initialParams: { q: "rxjs" },
    storeName: "meta-test",
  },
];

const store$ = Store.create({});

export const AntdDemo = () => {
  return (
    <StoreProvider value={store$}>
      <RequestProvider>
        <HighProvider elementsMap={ElementMap} metaList={metaList}>
          <List />
          {/*<RequestDemo />*/}
        </HighProvider>
      </RequestProvider>
    </StoreProvider>
  );
};
