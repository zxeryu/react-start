import React, { useCallback, useEffect, useRef, useState } from "react";
import { PickerModal, DatePicker } from "@react-start/components";
import { size, debounce, last } from "lodash";
import { CascadeProps } from "../../@react-start/components/src/picker";
import { DatePickerModal } from "../../@react-start/components/src/date-picker";
import { CascaderModal } from "../../@react-start/components/src/cascader";

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

export const TreeOptions = [
  {
    label: "1",
    value: "id-1",
    children: [
      { label: "1-1", value: "id-1-1", isLeaf: true },
      { label: "1-2", value: "id-1-2", isLeaf: true },
      { label: "1-3", value: "id-1-3", isLeaf: true },
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
          { label: "2-1-1", value: "id-2-1-1", isLeaf: true },
          { label: "2-1-2", value: "id-2-1-2", isLeaf: true },
        ],
      },
      { label: "2-2", value: "id-2-2", isLeaf: true },
      { label: "2-3", value: "id-2-3", isLeaf: true },
    ],
  },
];

const getOptions = (id: string) => {
  return new Promise((r) => {
    const resolve = (arr: any[]) => {
      setTimeout(() => {
        r(arr);
      }, 500);
    };

    if (id == "") {
      resolve([
        { label: "1", value: "id-1" },
        { label: "2", value: "id-2" },
      ]);
    } else if (id === "id-1") {
      resolve([
        { label: "1-1", value: "id-1-1", isLeaf: true },
        { label: "1-2", value: "id-1-2", isLeaf: true },
        { label: "1-3", value: "id-1-3", isLeaf: true },
      ]);
    } else if (id === "id-2") {
      resolve([
        { label: "2-1", value: "id-2-1" },
        { label: "2-2", value: "id-2-2" },
        { label: "2-3", value: "id-2-3", isLeaf: true },
      ]);
    } else if (id === "id-2-1") {
      resolve([
        { label: "2-1-1", value: "id-2-1-1", isLeaf: true },
        { label: "2-1-2", value: "id-2-1-2", isLeaf: true },
        { label: "2-1-3", value: "id-2-1-3", isLeaf: true },
      ]);
    } else if (id === "id-2-2") {
      resolve([
        { label: "2-2-1", value: "id-2-2-1", isLeaf: true },
        { label: "2-2-2", value: "id-2-2-2", isLeaf: true },
      ]);
    } else {
      resolve([]);
    }
  });
};

const setData = (columns: CascadeProps[], id: string, children: CascadeProps[]) => {
  for (let i = 0; i < columns.length; i++) {
    if (columns[i].value === id && !columns[i].children) {
      columns[i].children = children;
      return;
    }
  }

  for (let i = 0; i < columns.length; i++) {
    if (size(columns[i].children) > 0) {
      setData(columns[i].children!, id, children);
    }
  }
};

export const PickerDemo = () => {
  const [value, setValue] = useState<(string | number)[]>([]);

  const [columns, setColumns] = useState<CascadeProps[]>([]);
  const columnsRef = useRef<CascadeProps[]>(columns);
  columnsRef.current = columns;

  useEffect(() => {
    getOptions("").then((data) => {
      setColumns(data as any);
    });
  }, []);

  const addColumnsAsync = useCallback(
    debounce((id) => {
      getOptions(id).then((data: any) => {
        if (size(data) > 0) {
          setData(columnsRef.current, id, data);
          setColumns([...columnsRef.current]);
        }
      });
    }, 1000),
    [],
  );

  return (
    <div>
      <div>单个</div>
      <PickerModal mode={"single"} title={"单个"} columns={TestOptions} />

      <div>多个</div>
      <PickerModal mode={"multi"} title={"多个"} columns={[TestOptions, TestOptions]} />

      <div>级联</div>
      <PickerModal mode={"cascade"} title={"级联"} columns={TreeOptions} />

      <div>级联（异步数据）</div>
      <PickerModal
        mode={"cascade"}
        directChange
        title={"级联"}
        columns={columns}
        value={value}
        onChange={(values) => {
          setValue(values);
        }}
        onPickerChange={(values) => {
          console.log("@@@@@@@@@@@@@onPickerChange=", values);
          addColumnsAsync(last(values));
        }}
      />
    </div>
  );
};

const DatePickerDemo = () => {
  return (
    <div>
      <DatePicker
        type={"time"}
        filter={(options, type) => {
          if (type === "minute") {
            return options.filter(({ value }) => (value as number) % 5 === 0);
          }
          return options;
        }}
      />
      <DatePickerModal
        formatter={(str, type) => {
          switch (type) {
            case "year":
              return `${str}年`;
            case "month":
              return `${str}月`;
            case "day":
              return `${str}日`;
            case "hour":
              return `${str}时`;
            case "minute":
              return `${str}分`;
          }
          return str;
        }}
        onChange={(v) => {
          console.log("@@@@@@@@onChange===", v);
        }}
        onConfirm={(v) => {
          console.log("@@@@@@@@onConfirm===", v);
        }}
      />
    </div>
  );
};

const CascaderDemo = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const [columns, setColumns] = useState<CascadeProps[]>([]);
  const columnsRef = useRef<CascadeProps[]>(columns);
  columnsRef.current = columns;

  useEffect(() => {
    getOptions("").then((data) => {
      setColumns(data as any);
    });
  }, []);

  const addColumnsAsync = useCallback(
    debounce((id) => {
      setLoading(true);
      getOptions(id).then((data: any) => {
        if (size(data) > 0) {
          setData(columnsRef.current, id, data);
          setColumns([...columnsRef.current]);
        }
        setLoading(false);
      });
    }, 1000),
    [],
  );

  const [value, setValue] = useState<string>("id-2-1-2");

  return (
    <div>
      <CascaderModal
        mode={"parent"}
        columns={TreeOptions}
        title={"选择"}
        value={value}
        onConfirm={(v) => setValue(v as string)}
        initTextLabel={"2-1-2"}
      />

      <CascaderModal
        loading={loading}
        title={"异步选择"}
        columns={columns as any}
        value={value}
        onChange={(v) => {
          console.log("@@@@@@@@@", v);
          addColumnsAsync(v);
        }}
        onConfirm={(v) => setValue(v as string)}
      />
    </div>
  );
};

export const ReWriteComponent = () => {
  return (
    <div>
      <CascaderDemo />
      <DatePickerDemo />
      <PickerDemo />
    </div>
  );
};
