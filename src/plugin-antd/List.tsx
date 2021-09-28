import React from "react";
import { Tag, Space } from "antd";
import type { ProColumns } from "@ant-design/pro-table";
import {
  ElementProp,
  ElementMap,
  HighTableProps,
  ElementProps,
  ElementListProps,
} from "@react-start/cheng-plugin-antd";
import { HighPageProvider } from "@react-start/cheng-high";
import { ListEventHandler } from "./ListEventHandler";
import { useHighPage } from "../../@react-start/cheng-high/src";

type GithubIssueItem = {
  url: string;
  id: number;
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
};

const columns: ProColumns<GithubIssueItem>[] = [
  {
    title: "序号",
    dataIndex: "index",
    valueType: "index",
    width: 48,
  },
  {
    title: "标题",
    dataIndex: "title",
    copyable: true,
    ellipsis: true,
    // tip: "标题过长会自动收缩",
    formItemProps: {
      rules: [
        {
          required: true,
          message: "此项为必填项",
        },
      ],
    },
  },
  {
    title: "状态",
    dataIndex: "state",
    filters: true,
    onFilter: true,
    valueType: "select",
    valueEnum: {
      all: { text: "全部", status: "Default" },
      open: {
        text: "未解决",
        status: "Error",
      },
      closed: {
        text: "已解决",
        status: "Success",
        disabled: true,
      },
      processing: {
        text: "解决中",
        status: "Processing",
      },
    },
  },
  {
    title: "标签",
    dataIndex: "labels",
    search: false,
    renderFormItem: (_, { defaultRender }) => {
      return defaultRender(_);
    },
    render: (_, record) => (
      <Space>
        {record.labels.map(({ name, color }) => (
          <Tag color={color} key={name}>
            {name}
          </Tag>
        ))}
      </Space>
    ),
  },
  {
    title: "创建时间",
    key: "showTime",
    dataIndex: "created_at",
    valueType: "dateTime",
    sorter: true,
    hideInSearch: true,
  },
];

const props: HighTableProps = {
  columns,
  rowKey: "id",
  headerTitle: "高级表格",
  pagination: { pageSize: 5 },
  toolBarList: [
    {
      elementType$: "HighButton",
      oid: "HighButton-New",
      elementProps$: {
        type: "primary",
        children: "新建",
        highConfig: {
          sendEventName: "add",
        },
      },
    },
  ],
  operateList: [
    {
      elementType$: "HighA",
      oid: "HighA-Edit",
      elementProps$: {
        children: "编辑",
        highConfig: {
          sendEventName: "edit",
        },
      },
    },
    {
      elementType$: "HighA",
      oid: "HighA-Delete",
      elementProps$: {
        children: "删除",
        highConfig: {
          sendEventName: "delete",
        },
      },
    },
    {
      elementType$: "HighTableDropdown",
      oid: "HighTableDropdown-more",
      elementProps$: {
        options: [
          { label: "操作1", value: "111" },
          { label: "操作2", value: "222" },
          { label: "操作3", value: "333" },
        ],
        highConfig: {
          sendEventName: "more",
        },
      },
    },
  ],
  highConfig: {
    sendEventName: "table",
    receiveStateList: [
      { name: ["listData", "data"], mapName: "dataSource" },
      { name: ["listData", "total"], mapName: ["pagination", "total"], isObject: true },
      { name: "loading" },
    ],
  },
};

const tableConfig: ElementProp<ElementMap, "HighTable"> = {
  oid: "HighTable-O",
  elementType$: "HighTable",
  elementProps$: props,
};

const formChildrenConfigList: ElementListProps = [
  {
    oid: "HighFormText-O",
    elementType$: "HighFormText",
    elementProps$: {
      name: "name",
      label: "名称",
    },
  },
  {
    oid: "HighFormSelect-O",
    elementType$: "HighFormSelect",
    elementProps$: {
      name: "status",
      label: "状态",
      valueEnum: {
        open: "未解决",
        closed: "已解决",
      },
    },
  },
  {
    oid: "HighFormDigit-O",
    elementType$: "HighFormDigit",
    elementProps$: {
      name: "day",
      label: "天数",
    },
  },
  {
    oid: "HighFormDatePicker-O",
    elementType$: "HighFormDatePicker",
    elementProps$: {
      name: "time",
      label: "时间",
    },
  },
  {
    oid: "HighFormCheckboxGroup-O",
    elementType$: "HighFormCheckboxGroup",
    elementProps$: {
      name: "multi",
      label: "多选",
      options: [
        { label: "选项一", value: "111" },
        { label: "选项二", value: "222" },
        { label: "选项三", value: "333" },
      ],
    },
  },
  {
    oid: "HighFormRadioGroup-O",
    elementType$: "HighFormRadioGroup",
    elementProps$: {
      name: "single",
      label: "单选",
      options: [
        { label: "选项一", value: "111" },
        { label: "选项二", value: "222" },
        { label: "选项三", value: "333" },
      ],
    },
  },
  {
    oid: "HighFormSwitch-O",
    elementType$: "HighFormSwitch",
    elementProps$: {
      name: "select",
      label: "选择",
    },
  },
  {
    oid: "HighFormMoney-O",
    elementType$: "HighFormMoney",
    elementProps$: {
      name: "amount",
      label: "金额",
      locale: "en-US",
    },
  },
];

const formConfig: ElementProps = {
  oid: "HighSearchForm-O",
  elementType$: "HighSearchForm",
  elementProps$: {
    layout: "inline",
    mode: "direct",
    syncToUrl: true,
    debounceKeys: ["name", "day"],
    highConfig: {
      sendEventName: "search-form",
    },
  },
  elementList: formChildrenConfigList as any,
};

const configList = [formConfig, tableConfig];

const Content = () => {
  const { renderElementList } = useHighPage();
  return <>{renderElementList(configList)}</>;
};

export const List = () => {
  return (
    <HighPageProvider>
      <Content />
      <ListEventHandler />
    </HighPageProvider>
  );
};
