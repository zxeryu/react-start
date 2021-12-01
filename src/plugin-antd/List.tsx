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
import { HighPage } from "@react-start/cheng-high";
import { ListEventHandler } from "./ListEventHandler";

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
  options: { reload: true },
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
      elementType$: "HighA" as any,
      oid: "HighA-Edit",
      elementProps$: {
        children: "编辑",
        highConfig: {
          sendEventName: "edit",
          registerEventList: [{ name: "onClick" }],
        },
      },
    },
    {
      elementType$: "HighA" as any,
      oid: "HighA-Delete",
      elementProps$: {
        children: "删除",
        highConfig: {
          sendEventName: "delete",
          registerEventList: [{ name: "onClick" }],
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
          registerEventList: [{ name: "onSelect", transObjList: [{ key: "value", name: 0 }] }],
        },
      },
    },
  ],
  highConfig: {
    sendEventName: "table",
    receiveStateList: [
      { name: ["listData", "data"], mapName: "dataSource" },
      { name: ["listData", "total"], mapName: ["pagination", "total"] },
      { name: ["loading", "testLoading"], mapName: "loading", multiple: true },
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
      registerEventList: [
        { name: "onFinish" },
        // {
        //   name: "onFieldsChange",
        //   transObjList: [
        //     { key: "changedFields", name: 0 },
        //     { key: "allFields", name: 0 },
        //   ],
        // },
      ],
    },
  },
  elementList: formChildrenConfigList as any,
};

const configList: any = [
  {
    oid: "HighPageContainer-O",
    elementType$: "HighPageContainer",
    elementProps$: {
      style: { padding: -20 },
      title: {
        oid: "HighSpan-O",
        elementType$: "HighSpan",
        elementProps$: {
          style: { cursor: "pointer" },
          children: "HighPageContainer-HighSpan",
          highConfig: {
            sendEventName: "title",
            registerEventList: [{ name: "onClick" }],
          },
        },
      },
      footer: {
        oid: "HighSpan-O",
        elementType$: "HighSpan",
        elementProps$: {
          children: "footer",
          style: {
            color: "red",
          },
        },
      },
      content: {
        oid: "HighSpan-O",
        elementType$: "HighSpan",
        elementProps$: {
          children: "content",
          style: {
            color: "red",
          },
        },
      },
      highConfig: {
        transformElementList: [{ name: "title" }],
      },
    },
    elementList: [
      formConfig,
      tableConfig,
      {
        oid: "HighModalForm-O",
        elementType$: "HighModalForm",
        elementProps$: {
          title: "ModalForm",
          loading: true,
          highConfig: {
            sendEventName: "modal-form",
            receiveStateList: [{ name: "modalVisible", mapName: "visible" }],
            registerEventList: [
              {
                name: "onFinish",
                executeList: [
                  {
                    execName: "dispatch",
                    execParams: ["modalVisible", false],
                  },
                ],
              },
            ],
          },
        },
        elementList: [
          {
            oid: "HighSpan-O",
            elementType$: "HighSpan",
            elementProps$: {
              children: "modal-form-content",
            },
          },
        ],
      },
      {
        oid: "HighDrawerForm-O",
        elementType$: "HighDrawerForm",
        elementProps$: {
          title: "HighDrawerForm",
          loading: true,
          initialValues: { name: "aaa" },
          cancelButtonProps: { style: { color: "red" } },
          highConfig: {
            sendEventName: "drawer-form",
            receiveStateList: [{ name: "drawerVisible", mapName: "visible" }],
            registerEventList: [
              {
                name: "onFinish",
                executeList: [
                  {
                    execName: "dispatch",
                    execParams: ["drawerVisible", false],
                  },
                ],
              },
              {
                name: "drawerProps.onClose",
                executeList: [
                  {
                    execName: "dispatch",
                    execParams: ["drawerVisible", false],
                  },
                ],
              },
            ],
          },
        },
        elementList: [
          {
            oid: "HighSpan-O",
            elementType$: "HighSpan",
            elementProps$: {
              children: "drawer-form-content",
            },
          },
        ],
      },
      {
        oid: "HighSpan-O",
        elementType$: "HighSpan",
        elementProps$: {
          // children: "span",
          highConfig: {
            receiveStateList: [{ name: "store-test", mapName: "children" }],
          },
        },
      },
      {
        elementType$: "HighButton",
        oid: "HighButton-New",
        elementProps$: {
          type: "primary",
          children: "状态测试",
          highConfig: {
            sendEventName: "store-test",
            registerEventList: [
              {
                name: "onClick",
                executeList: [
                  {
                    execName: "dispatch",
                    execParams: ["store-test", { name: "0.timeStamp", target: "arguments" }],
                  },
                ],
              },
            ],
          },
        },
      },
      {
        oid: "HighButton-modal",
        elementType$: "HighButton",
        elementProps$: {
          type: "primary",
          children: "modal-form",
          highConfig: {
            sendEventName: "modal-form-button",
            registerEventList: [
              {
                name: "onClick",
                executeList: [
                  {
                    execName: "dispatch",
                    execParams: ["modalVisible", true],
                  },
                ],
              },
            ],
          },
        },
      },
      {
        oid: "HighButton-drawer",
        elementType$: "HighButton",
        elementProps$: {
          type: "primary",
          children: "drawer-form",
          highConfig: {
            sendEventName: "drawer-form-button",
            registerEventList: [
              {
                name: "onClick",
                executeList: [
                  {
                    execName: "dispatch",
                    execParams: ["drawerVisible", true],
                  },
                ],
              },
            ],
          },
        },
      },
      {
        oid: "HighForm-O",
        elementType$: "HighForm",
        elementProps$: {
          highConfig: {
            sendEventName: "form",
            registerEventList: [{ name: "onFinish" }],
          },
        },
        elementList: [
          {
            oid: "HighFormEditTableItem-O",
            elementType$: "HighFormEditTableItem",
            elementProps$: {
              name: "form-table-数据",
              label: "form-table",
              trigger: "onValuesChange",
              fieldProps: {
                rowKey: "id",
                columns: [
                  {
                    title: "序号",
                    dataIndex: "index",
                  },
                  {
                    title: "姓名",
                    dataIndex: "name",
                  },
                  {
                    title: "年龄",
                    dataIndex: "age",
                  },
                  {
                    title: "操作1111",
                    valueType: "option",
                    element: {
                      elementType$: "HighA" as any,
                      oid: "HighA-Edit",
                      elementProps$: {
                        children: "编辑",
                        highConfig: {
                          sendEventName: "edit",
                          registerEventList: [{ name: "onClick" }],
                        },
                      },
                    },
                  },
                ],
                recordCreatorProps: {
                  newRecordType: "dataSource",
                  record: () => ({
                    id: Date.now().valueOf(),
                  }),
                },
                // editable: {
                //   type: "multiple",
                //   actions: { delete: true },
                // },
                // highConfig: {
                //   sendEventName: "edit-table",
                //   receiveStateList: [{ name: "dataSource", mapName: "value" }],
                //   registerEventList: [
                //     {
                //       name: "onChange",
                //       executeList: [{ execName: "dispatch", execParams: ["dataSource", { name: 0 }] }],
                //     },
                //     {
                //       name: "editable.onValuesChange",
                //       executeList: [{ execName: "dispatch", execParams: ["dataSource", { name: 1 }] }],
                //     },
                //   ],
                // },
              },
            },
          },
        ],
      },
    ],
  },
];

export const List = () => {
  return (
    <HighPage
      configData={{
        registerStore: ["store-test"],
        registerMeta: ["meta-test"],
        page: configList,
      }}>
      <ListEventHandler />
    </HighPage>
  );
};
