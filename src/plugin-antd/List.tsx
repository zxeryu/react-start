import React from "react";
import { Tag, Space } from "antd";
import { HighPage, ElementConfigBase } from "@react-start/cheng-high";
import { ListEventHandler } from "./ListEventHandler";

const formChildrenConfigList: ElementConfigBase[] = [
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

const formConfig: ElementConfigBase = {
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
      {
        oid: "HighCURD-O",
        elementType$: "HighCURD",
        elementProps$: {
          highConfig: {
            sendEventName: "table",
            receiveStateList: [
              { name: ["listData", "data"], mapName: "dataSource" },
              { name: ["listData", "total"], mapName: "total" },
              { name: ["loading", "testLoading"], mapName: "loading", multiple: true },
              { name: "visible" },
              { name: "title" },
              {
                name: "record",
                mapName: "modalFormProps.initialValues",
              },
            ],
            registerEventList: [
              {
                name: "tableProps.pagination.onChange",
              },
              {
                name: "modalFormProps.modalProps.onCancel",
                executeList: [
                  {
                    execName: "dispatch",
                    execParams: [
                      "compose",
                      {
                        visible: false,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          rowKey: "id",
          destroyOnClose: true,
          tableProps: {
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
                    registerEventList: [
                      {
                        name: "onClick",
                        executeList: [
                          {
                            execName: "dispatch",
                            execParams: [
                              "compose",
                              {
                                visible: true,
                                title: "添加",
                                record: undefined,
                              },
                            ],
                          },
                        ],
                      },
                    ],
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
                    registerEventList: [
                      {
                        name: "onClick",
                        executeList: [
                          {
                            execName: "dispatch",
                            execParams: ["record", { name: "record" }],
                          },
                          {
                            execName: "dispatch",
                            execParams: [
                              "compose",
                              {
                                visible: true,
                                title: "添加",
                              },
                            ],
                          },
                        ],
                      },
                    ],
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
            ],
          },
          columns: [
            {
              title: "序号",
              dataIndex: "index",
              valueType: "index",
              width: 48,
              hideInForm: true,
            },
            {
              title: "标题",
              dataIndex: "title",
              copyable: true,
              ellipsis: true,
              formElement: {
                elementType$: "HighFormText",
                elementProps$: {},
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
              formElement: {
                elementType$: "HighFormSelect",
                elementProps$: {
                  options: [
                    { label: "全部", value: "Default" },
                    { label: "未解决", value: "Error" },
                    { label: "已解决", value: "Success" },
                    { label: "解决中", value: "Processing" },
                  ],
                },
              },
            },
            {
              title: "标签",
              dataIndex: "labels",
              search: false,
              render: (_: any, record: any) => (
                <Space>
                  {record.labels.map(({ name, color }: any) => (
                    <Tag color={color} key={name}>
                      {name}
                    </Tag>
                  ))}
                </Space>
              ),
              hideInForm: true,
            },
            {
              title: "创建时间",
              key: "showTime",
              dataIndex: "created_at",
              valueType: "dateTime",
              sorter: true,
              formElement: {
                elementType$: "HighFormDatePicker",
                elementProps$: {},
              },
            },
          ],
        },
      },
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
