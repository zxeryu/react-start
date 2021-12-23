import React, { useState } from "react";
import { map } from "lodash";
import { IElement, ChengProvider, ConfigTree, ElementFormModal } from "@react-start/cheng";
import { IConfigData } from "@react-start/cheng-high";

const LayoutElements: IElement[] = [
  { name: "HighPageContainer", isContainer: true },
  { name: "HighCard", isContainer: true },
  { name: "HighCardTabPane", isContainer: true },
  { name: "HighCardDivider" },
  { name: "HighWaterMark" },
];

const FormElements: IElement[] = [
  { name: "HighForm", isContainer: true },
  { name: "HighModalForm", isContainer: true },
  { name: "HighDrawerForm", isContainer: true },
  { name: "HighSearchForm", isContainer: true },
  { name: "HighFormList", isContainer: true },
  { name: "HighFormGroup", isContainer: true },
  { name: "HighFormItem", isContainer: true },
  { name: "HighFormText" },
  { name: "HighFormTextArea" },
  { name: "HighFormPassword" },
  { name: "HighFormCaptcha" },
  { name: "HighFormDigit" },
  { name: "HighFormDatePicker" },
  { name: "HighFormDateRangePicker" },
  { name: "HighFormTimePicker" },
  { name: "HighFormTimeRangePicker" },
  { name: "HighFormDateTimePicker" },
  { name: "HighFormDateTimeRangePicker" },
  {
    name: "HighFormSelect",
    setProps: [
      { name: "name", valueType: "text" },
      { name: "label", valueType: "text" },
      { name: "placeholder", valueType: "text" },
      {
        name: "options",
        label: "options",
        valueType: "text",
        groupType: "array",
        children: [
          { name: "label", valueType: "text" },
          { name: "value", valueType: "text" },
        ],
      },
      {
        name: "compose",
        label: "复杂结构",
        groupType: "object",
        children: [
          { name: "属性1", valueType: "text" },
          { name: "属性2", valueType: "text" },
          {
            name: "属性3",
            valueType: "select",
            options: [
              { label: "option1", value: "option" },
              { label: "option2", value: "option2" },
              { label: "option3", value: "option3" },
            ],
          },
        ],
      },
    ],
  },
  { name: "HighFormCheckbox" },
  { name: "HighFormCheckboxGroup" },
  { name: "HighFormRadioGroup" },
  { name: "HighFormSwitch" },
  { name: "HighFormRate" },
  { name: "HighFormSlider" },
  { name: "HighFormMoney" },
];

const TableElements: IElement[] = [
  { name: "HighTable" },
  { name: "HighEditTable" },
  { name: "HighFormEditTableItem" },
  { name: "HighTableDropdown" },
];

const elements: IElement[] = [
  ...map(LayoutElements, (item) => ({ ...item, group: "Layout" })),
  ...map(FormElements, (item) => ({ ...item, group: "Form" })),
  ...map(TableElements, (item) => ({ ...item, group: "Table" })),
];

const data = {
  page: {
    oid: "HighForm-O",
    elementType$: "HighForm",
    elementProps$: {
      formName: "edit-form",
      style: {
        backgroundColor: "white",
        padding: "1em 1.5em",
      },
      highConfig: {
        sendEventName: "form",
        receiveStateList: [
          { name: "safeData", mapName: "initialValues" },
          {
            name: "isEdit",
            mapName: "readonly",
            expression: {
              funName: "isEqual",
              funParams: [{ name: "value" }, false],
            },
          },
          {
            name: "haveData",
            mapName: "submitter.resetButtonProps.style.display",
            expression: {
              funName: "ternary",
              funParams: [{ name: "value" }, "block", "none"],
            },
          },
          {
            name: "isEdit",
            mapName: "submitter.searchConfig.resetText",
            expression: {
              funName: "ternary",
              funParams: [{ name: "value" }, "取消", "编辑"],
            },
          },
          {
            name: "isEdit",
            mapName: "submitter.submitButtonProps.style.display",
            expression: {
              funName: "ternary",
              funParams: [{ name: "value" }, "block", "none"],
            },
          },
        ],
        registerEventList: [
          {
            name: "onFinish",
          },
          {
            name: "submitter.onReset",
            executeList: [
              {
                execName: "dispatch",
                execParams: [
                  "isEdit",
                  { funName: "ternary", funParams: [{ name: "isEdit", target: "state" }, false, true] },
                ],
              },
            ],
          },
        ],
      },
    },
    elementList: [
      {
        oid: "HighFormGroup-O",
        elementType$: "HighFormGroup",
        elementProps$: {},
        elementList: [
          {
            oid: "HighFormSelect-fEnterprisesType",
            elementType$: "HighFormSelect",
            elementProps$: {
              name: "fEnterprisesType",
              label: "企业类型",
              width: "sm",
              highConfig: {
                receiveStateList: [{ name: "enterpriseTypeOptions", mapName: "options" }],
              },
            },
          },
          {
            oid: "HighFormSelect-fStandardizedGrade",
            elementType$: "HighFormSelect",
            elementProps$: {
              name: "fStandardizedGrade",
              label: "安全生产标准化等级",
              width: "sm",
              highConfig: {
                receiveStateList: [{ name: "levelTypeOptions", mapName: "options" }],
              },
            },
          },
          {
            oid: "HighFormRadioGroup-fFireAcceptance",
            elementType$: "HighFormRadioGroup",
            elementProps$: {
              name: "fFireAcceptance",
              label: "消防验收",
              options: [
                { label: "是", value: "YES" },
                { label: "否", value: "NO" },
              ],
              fieldProps: {
                style: { width: 216 },
              },
            },
          },
          {
            oid: "HighFormRadioGroup-fRegularInspection",
            elementType$: "HighFormRadioGroup",
            elementProps$: {
              name: "fRegularInspection",
              label: "防雷验收或定期检查",
              options: [
                { label: "是", value: "YES" },
                { label: "否", value: "NO" },
              ],
              highConfig: {
                sendEventName: "inspection",
                registerEventList: [
                  {
                    name: "fieldProps.onChange",
                    executeList: [
                      {
                        execName: "dispatch",
                        execParams: [
                          "inspectionFileShow",
                          { funName: "isEqual", funParams: ["YES", { name: "0.target.value" }] },
                        ],
                      },
                    ],
                  },
                ],
              },
            },
          },
          {
            oid: "HighUploaderFormText-fRegularInspectionFile",
            elementType$: "HighUploaderFormText",
            elementProps$: {
              name: "fRegularInspectionFile",
              label: " ",
              fieldProps: { single: true },
              show: false,
              highConfig: {
                receiveStateList: [{ name: "inspectionFileShow", mapName: "show" }],
              },
            },
          },
        ],
      },
      {
        oid: "HighFormGroup-Second",
        elementType$: "HighFormGroup",
        elementProps$: {},
        elementList: [
          {
            oid: "HighFormDigit-fDangerousNumberPersonnel",
            elementType$: "HighFormDigit",
            elementProps$: {
              name: "fDangerousNumberPersonnel",
              label: "危险化学品作业人员数",
              fieldProps: { precision: 0 },
              width: "sm",
            },
          },
          {
            oid: "HighFormDigit-fPoisonousNumberPersonnel",
            elementType$: "HighFormDigit",
            elementProps$: {
              name: "fPoisonousNumberPersonnel",
              label: "剧毒化学作业人员数",
              fieldProps: { precision: 0 },
              width: "sm",
            },
          },
          {
            oid: "HighFormDigit-fSpecialNumberPersonnel",
            elementType$: "HighFormDigit",
            elementProps$: {
              name: "fSpecialNumberPersonnel",
              label: "特种作业人员数",
              fieldProps: { precision: 0 },
              width: "sm",
            },
          },
          {
            oid: "HighFormDigit-fSafetyNumberPersonnel",
            elementType$: "HighFormDigit",
            elementProps$: {
              name: "fSafetyNumberPersonnel",
              label: "专职安全管理人员数",
              fieldProps: { precision: 0 },
              width: "sm",
            },
          },
        ],
      },
      {
        oid: "HighFormGroup-Third",
        elementType$: "HighFormGroup",
        elementProps$: {
          title: "安全设施“三同时”情况",
        },
      },
      {
        oid: "HighUploaderFormText-fSafetyReport",
        elementType$: "HighUploaderFormText",
        elementProps$: {
          name: "fSafetyReport",
          label: "安全预评价报告",
          fieldProps: { single: true },
        },
      },
      {
        oid: "HighUploaderFormText-fDesignReport",
        elementType$: "HighUploaderFormText",
        elementProps$: {
          name: "fDesignReport",
          label: "设计安全报告",
          fieldProps: { single: true },
        },
      },
      {
        oid: "HighUploaderFormText-fAcceptanceReport",
        elementType$: "HighUploaderFormText",
        elementProps$: {
          name: "fAcceptanceReport",
          label: "验收评价报告",
          fieldProps: { single: true },
        },
      },
      {
        oid: "HighFormGroup-Fourth",
        elementType$: "HighFormGroup",
        elementProps$: {
          title: "安全负责人信息",
        },
      },
      {
        oid: "HighFormEditTableItem-O",
        elementType$: "HighFormEditTableItem",
        elementProps$: {
          name: "safetyDirectors",
          fieldProps: {
            rowKey: "id",
            style: {
              margin: "0 -20px",
            },
            columns: [
              {
                title: "序号",
                dataIndex: "index",
                valueType: "index",
                width: 60,
              },
              {
                title: "安全负责人姓名",
                dataIndex: "enterpriseAccountId",
                editElement: {
                  oid: "HighUserTreeSelect-userName",
                  elementType$: "HighUserTreeSelect",
                  elementProps$: {
                    placeholder: "请选择",
                  },
                },
              },
              {
                title: "安全负责人类型",
                dataIndex: "safetyType",
                valueType: "select",
                editElement: {
                  oid: "HighSelect-safetyType",
                  elementType$: "HighSelect",
                  elementProps$: {
                    placeholder: "请选择",
                    highConfig: {
                      receiveStateList: [
                        {
                          name: "safeTypeOptions",
                          mapName: "options",
                        },
                      ],
                    },
                  },
                },
              },
              {
                title: "是否接收短信",
                dataIndex: "sendMsg",
                valueType: "switch",
                tooltip: "若开启，在企业收到隐患整改通知时会给对应人员发送短信",
              },
            ],
            operateList: [
              {
                oid: "HighA-edit",
                elementType$: "HighA",
                elementProps$: {
                  children: "编辑",
                  highConfig: {
                    sendEventName: "edit",
                    registerEventList: [{ name: "onClick" }],
                  },
                },
              },
            ],
            recordCreatorProps: {
              record: {
                rowKeyName: "id",
              },
            },
          },
        },
      },
      {
        oid: "HighFormGroup-Fifth",
        elementType$: "HighFormGroup",
        elementProps$: {
          title: "机构设置",
        },
      },
      {
        oid: "HighFormRadioGroup-fSafetyCommitteeSetup",
        elementType$: "HighFormRadioGroup",
        elementProps$: {
          name: "fSafetyCommitteeSetup",
          label: "安全委员会",
          options: [
            { label: "已设置", value: "YES" },
            { label: "未设置", value: "NO" },
          ],
        },
      },
      {
        oid: "HighFormRadioGroup-fSafetyManager",
        elementType$: "HighFormRadioGroup",
        elementProps$: {
          name: "fSafetyManager",
          label: "安全生产管理机构或安全生产管理人员",
          options: [
            { label: "已设置", value: "YES" },
            { label: "未设置", value: "NO" },
          ],
        },
      },
      {
        oid: "HighFormRadioGroup-fHealthAdministrator",
        elementType$: "HighFormRadioGroup",
        elementProps$: {
          name: "fHealthAdministrator",
          label: "职业卫生管理机构或职业卫生管理人员",
          options: [
            { label: "已设置", value: "YES" },
            { label: "未设置", value: "NO" },
          ],
        },
      },
      {
        oid: "HighFormGroup-Sixth",
        elementType$: "HighFormGroup",
        elementProps$: {
          title: "持证上岗人员",
        },
      },
      {
        oid: "HighFormEditTableItem-O-member",
        elementType$: "HighFormEditTableItem",
        elementProps$: {
          name: "safetyInformationPersonnels",
          fieldProps: {
            rowKey: "fId",
            style: {
              margin: "0 -20px",
            },
            columns: [
              {
                title: "序号",
                dataIndex: "index",
                valueType: "index",
                width: 60,
              },
              {
                title: "姓名",
                dataIndex: "fUserName",
                valueType: "text",
                formItemProps: {
                  rules: [{ required: true, message: "请输入姓名" }],
                },
              },
              {
                title: "手机号",
                dataIndex: "fPhone",
                formItemProps: {
                  rules: [
                    { required: true, message: "请输入手机号" },
                    {
                      pattern: "^1[3456789]\\d{9}$",
                      message: "请输入正确手机号",
                    },
                  ],
                },
              },
              {
                title: "证件类型",
                dataIndex: "fCertificateType",
                formItemProps: {
                  rules: [{ required: true, message: "请输入姓名" }],
                },
                editElement: {
                  oid: "HighSelect-fCertificateType",
                  elementType$: "HighSelect",
                  elementProps$: {
                    placeholder: "请选择",
                    highConfig: {
                      sendEventName: "certificateType",
                      receiveStateList: [
                        {
                          name: "credentialsTypeOptions",
                          mapName: "options",
                        },
                      ],
                      registerEventList: [
                        {
                          name: "onChange",
                          executeList: [
                            {
                              execName: "dispatch",
                              execParams: [
                                "credentialsGroupOptions",
                                {
                                  funName: "get",
                                  funParams: [{ name: "credentialsMap", target: "dataRef" }, { name: 0 }],
                                },
                              ],
                            },
                          ],
                        },
                      ],
                    },
                  },
                },
              },
              {
                title: "证件分类",
                dataIndex: "fCertificateGroup",
                editElement: {
                  oid: "HighSelect-fCertificateGroup",
                  elementType$: "HighSelect",
                  elementProps$: {
                    placeholder: "请选择",
                    allowClear: true,
                    highConfig: {
                      receiveStateList: [
                        {
                          name: "credentialsGroupOptions",
                          mapName: "options",
                        },
                      ],
                    },
                  },
                },
              },
              {
                title: "证件生效时间",
                dataIndex: "fEffectiveDate",
                formItemProps: {
                  rules: [{ required: true, message: "请输入时间" }],
                },
                editElement: {
                  oid: "HighDatePicker-fEffectiveDate",
                  elementType$: "HighDatePicker",
                  elementProps$: {},
                },
              },
              {
                title: "证件失效时间",
                dataIndex: "fFailureDate",
                formItemProps: {
                  rules: [{ required: true, message: "请输入时间" }],
                },
                editElement: {
                  oid: "HighDatePicker-fFailureDate",
                  elementType$: "HighDatePicker",
                  elementProps$: {},
                },
              },
              {
                title: "PDF扫描件",
                dataIndex: "fScanFiles",
                editElement: {
                  oid: "HighUploaderText-fScanFiles",
                  elementType$: "HighUploaderText",
                  elementProps$: {
                    single: true,
                    buttonProps: { type: "link" },
                    fileType: "image",
                  },
                },
              },
            ],
            operateList: [
              {
                oid: "HighA-edit",
                elementType$: "HighA",
                elementProps$: {
                  children: "编辑",
                  highConfig: {
                    sendEventName: "member-edit",
                    registerEventList: [{ name: "onClick" }],
                  },
                },
              },
            ],
            recordCreatorProps: {
              record: {
                rowKeyName: "fId",
              },
            },
          },
        },
      },
    ],
  },
};

export const DragOperatorDemo = () => {
  const [configData, setConfigData] = useState<IConfigData>(data);

  return (
    <div css={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
      <ChengProvider
        elements={elements}
        configData={configData}
        onConfigChange={(configData) => {
          setConfigData(configData);
        }}>
        <ConfigTree />
        <ElementFormModal />
      </ChengProvider>
    </div>
  );
};
