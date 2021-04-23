import React from "react";
import { HighForm, IHighFormData } from "@react-start/components";

const structureData: IHighFormData = {
  formProps: {
    mode: "horizontal",
    labelStyle: { width: "20%", textAlign: "right" },
    inputStyle: { width: "50%" },
  },
  items: [
    { type: "TextInput", itemProps: { name: "text", label: "Text" }, elementProps: { placeholder: "请输入" } },
    {
      type: "SelectInput",
      itemProps: { name: "select", label: "Select" },
      elementProps: {
        options: [
          { label: "选择一", value: 1 },
          { label: "选择二", value: 2 },
          { label: "选择三", value: 3 },
        ],
      },
    },
  ],
};

export const FormHighDemo = () => {
  return (
    <div>
      FormHighDemo
      <HighForm data={structureData} />
    </div>
  );
};
