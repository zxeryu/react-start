import React, { useState } from "react";
import { PickerModal } from "@react-start/components";

const TestOptions = [
  { label: "000", value: "0" },
  { label: "111", value: "1" },
  { label: "222", value: "2" },
  { label: "333", value: "3", disabled: true },
  { label: "444", value: "4" },
  { label: "555", value: "5" },
  { label: "666", value: "6" },
  { label: "777", value: "7" },
  { label: "888", value: "8" },
  { label: "999", value: "9" },
];

export const ReWriteComponent = () => {
  const [value, setValue] = useState<(string | number)[]>([]);

  return (
    <div>
      <div>单个</div>
      <PickerModal mode={"single"} title={"单个"} columns={TestOptions} />

      <div>多个</div>
      <PickerModal mode={"multi"} title={"多个"} columns={[TestOptions, TestOptions]} />

      <div>级联</div>
      <PickerModal
        mode={"cascade"}
        title={"级联"}
        columns={[
          {
            label: "1",
            value: "id-1",
            children: [
              { label: "1-1", value: "id-1-1" },
              { label: "1-2", value: "id-1-2" },
              { label: "1-3", value: "id-1-3" },
            ],
          },
          {
            label: "2",
            value: "id-2",
            children: [
              {
                label: "2-1",
                value: "id-2-1",
                children: [
                  { label: "2-1-1", value: "id-2-1-1" },
                  { label: "2-1-2", value: "id-2-1-2" },
                ],
              },
              { label: "2-2", value: "id-2-2" },
              { label: "2-3", value: "id-2-3" },
            ],
          },
        ]}
        value={value}
        onChange={(values) => {
          setValue(values);
          console.log("@@@@@@@@@@@@@", values);
        }}
      />
    </div>
  );
};
