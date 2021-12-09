import React, { ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import ProTable, { ActionType, ProTableProps, EditableProTable } from "@ant-design/pro-table";
import ProForm, { ProFormInstance } from "@ant-design/pro-form";
import { HighProps, useHighPage, ComponentWrapper, ElementConfigBase } from "@react-start/cheng-high";
import { Space } from "antd";
import { TablePaginationConfig } from "antd/lib/table/interface";
import { EditableProTableProps } from "@ant-design/pro-table/es/components/EditableTable";
import { useUrlSearchParams } from "@umijs/use-params";
import { get, map, size, set, isString } from "lodash";
import { ProColumns } from "@ant-design/pro-table/lib/typing";
import { ProFormFieldItemProps } from "@ant-design/pro-form/lib/interface";

type ParamsType = Record<string, any>;

export interface TableProps extends Omit<ProTableProps<any, ParamsType>, "actionRef"> {
  syncPageToUrl?: boolean;
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  tableName?: string;
  toolBarList?: ElementConfigBase[];
  operateList?: ElementConfigBase[];
  operateColumn?: ProColumns<any, ParamsType>;
}

export interface HighTableProps extends TableProps, HighProps {}

export const useColumnsWithOperate = (
  columns?: HighTableProps["columns"],
  operateList?: ElementConfigBase[],
  operateColumn?: HighTableProps["operateColumn"],
): HighTableProps["columns"] => {
  const { render, sendEvent } = useHighPage();

  return useMemo(() => {
    if (!columns) {
      return columns;
    }

    const reColumns = map(columns, (item) => {
      //form item 展示
      const elementConfig = get(item, "element");
      if (elementConfig) {
        item.render = (_, record, index) => {
          const value = get(record, item.dataIndex!);
          const key = record ? JSON.stringify(record) : Date.now().valueOf();
          elementConfig.elementProps$ = { ...elementConfig.elementProps$, value, record, index };
          return render({ ...elementConfig, oid: `${elementConfig.oid}-${index}-${key}-${item.dataIndex}` });
        };
      }
      //form item 录入
      const editElementConfig = get(item, "editElement");
      if (editElementConfig) {
        item.renderFormItem = (...e) => {
          const index = get(e, [0, "index"]);
          const highArgs = e;
          return render(
            {
              ...editElementConfig,
              oid: `${editElementConfig.oid}-${index}-${item.dataIndex}`,
            },
            {
              onSend: (actionOrigin) => {
                const action = { ...actionOrigin };
                set(action, "payload", { ...action.payload, highArgs });
                sendEvent(action);
              },
            },
          );
        };
      }
      //form item rule pattern 转换：string转regexp对象
      const rules = get(item, ["formItemProps", "rules"]);
      if (rules && size(rules) > 0) {
        set(
          item,
          ["formItemProps", "rules"],
          map(rules, (rule) => {
            if (isString(rule.pattern)) {
              rule.pattern = new RegExp(rule.pattern);
            }
            return rule;
          }),
        );
      }
      return item;
    });

    if (size(operateList) > 0) {
      reColumns.push({
        title: "操作",
        valueType: "option",
        ...(operateColumn as any),
        render: (_, record, index, a, schema) => {
          const key = record ? JSON.stringify(record) : Date.now().valueOf();
          return (
            <Space>
              {map(operateList || [], (c) =>
                render(
                  { ...c, oid: `${c.oid}-${index}-${key}` },
                  {
                    onSend: (actionOrigin) => {
                      const action = { ...actionOrigin };
                      set(action, "payload", { ...action.payload, record, index, action: a, schema });
                      sendEvent(action);
                    },
                  },
                ),
              )}
            </Space>
          );
        },
      });
    }
    return reColumns;
  }, [columns, operateList, operateColumn]);
};

const useHighTableOptions = ({
  tableName,
  actionRef: actionRefOrigin,
  columns,
  operateList,
  operateColumn,
  toolBarList,
}: Pick<HighTableProps, "tableName" | "actionRef" | "columns" | "operateList" | "operateColumn" | "toolBarList">) => {
  const { setDataToRef, render } = useHighPage();
  const actionRef = useRef<ActionType>();

  useEffect(() => {
    tableName && setDataToRef(tableName, actionRefOrigin ? actionRefOrigin.current : actionRef.current);
  }, []);

  const reColumns = useColumnsWithOperate(columns, operateList, operateColumn);

  const handleToolBarRender: any = useCallback(() => {
    if (!toolBarList) {
      return null;
    }
    return render(toolBarList);
  }, [toolBarList]);

  return {
    actionRef: actionRefOrigin || actionRef,
    columns: reColumns,
    toolBarRender: handleToolBarRender,
  };
};

export const Table = ({
  tableName,
  columns,
  operateList,
  operateColumn,
  toolBarList,
  syncPageToUrl,
  pagination,
  ...otherProps
}: TableProps) => {
  const actionRef = useRef<ActionType>();

  const [urlState, setUrlState] = useUrlSearchParams(
    syncPageToUrl
      ? {
          page: get(otherProps, ["pagination", "current"], 1),
          pageSize: get(otherProps, ["pagination", "pageSize"], 10),
        }
      : {},
  );

  const handlePageChange: TablePaginationConfig["onChange"] = useCallback((page, pageSize) => {
    //todo:: pro-table bug 执行两次
    const pageInfo = get(actionRef, ["current", "pageInfo"]);
    if (pageInfo?.current === page && pageInfo?.pageSize === pageSize) {
      return;
    }
    if (syncPageToUrl) {
      setUrlState({ page, pageSize });
    }
    const onChange = get(pagination, "onChange");
    onChange && onChange(page, pageSize);
  }, []);

  const handleShowSizeChange: TablePaginationConfig["onShowSizeChange"] = useCallback((page, pageSize) => {
    //todo:: pro-table bug 不改变也会执行
    const pageInfo = get(actionRef, ["current", "pageInfo"]);
    if (pageInfo?.current === page && pageInfo?.pageSize === pageSize) {
      return;
    }
    if (syncPageToUrl) {
      setUrlState({ page, pageSize });
    }
    const onShowSizeChange = get(pagination, "onShowSizeChange");
    onShowSizeChange && onShowSizeChange(page, pageSize);
  }, []);

  const rePagination: undefined | false | TablePaginationConfig = useMemo(() => {
    if (!pagination) {
      return pagination;
    }
    return {
      current: syncPageToUrl ? Number(urlState.page) : pagination?.current,
      pageSize: syncPageToUrl ? Number(urlState.pageSize) : pagination?.pageSize,
      ...pagination,
      onChange: handlePageChange,
      onShowSizeChange: handleShowSizeChange,
    };
  }, [pagination, urlState]);

  const reOptions = useHighTableOptions({
    tableName,
    actionRef,
    columns,
    operateList,
    operateColumn,
    toolBarList,
  });

  return <ProTable {...reOptions} search={false} pagination={rePagination} {...otherProps} />;
};

export const HighTable = (props: HighTableProps) => {
  return <ComponentWrapper Component={Table} {...props} />;
};

interface EditTableProps extends Omit<EditableProTableProps<any, ParamsType>, "actionRef" | "editable"> {
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  editable?: EditableProTableProps<any, ParamsType>["editable"] & {
    actions?: {
      save?: boolean;
      delete?: boolean;
      cancel?: boolean;
    };
  };
  //
  tableName?: string;
  formName?: string;
  toolBarList?: ElementConfigBase[];
  operateList?: ElementConfigBase[];
  operateColumn?: ProColumns<any, ParamsType>;
}

const EditTable = ({
  tableName,
  actionRef: actionRefOrigin,
  formName,
  columns,
  operateList,
  operateColumn,
  toolBarList,
  editable,
  recordCreatorProps,
  ...otherProps
}: EditTableProps) => {
  const { setDataToRef } = useHighPage();
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    formName && setDataToRef(formName, formRef.current);
  }, []);

  const reOptions: any = useHighTableOptions({
    tableName,
    actionRef: actionRefOrigin,
    columns,
    operateList,
    operateColumn,
    toolBarList,
  });

  const reEditable = useMemo(() => {
    if (!editable) {
      return editable;
    }

    const reActionRender = (
      _: any,
      _2: any,
      defaultDoms: { save: ReactNode; delete: ReactNode; cancel: ReactNode },
    ) => {
      const arr: ReactNode[] = [];
      if (editable.actions?.save) {
        arr.push(defaultDoms.save);
      }
      if (editable.actions?.delete) {
        arr.push(defaultDoms.delete);
      }
      if (editable.actions?.cancel) {
        arr.push(defaultDoms.cancel);
      }
      return arr;
    };

    return {
      actionRender: editable.actions ? reActionRender : undefined,
      formProps: {
        formRef,
      },
      ...editable,
    };
  }, [editable]);

  const reRecordCreatorProps: EditTableProps["recordCreatorProps"] = useMemo(() => {
    if (!recordCreatorProps) {
      return recordCreatorProps;
    }
    return {
      ...recordCreatorProps,
      record: (index: number) => {
        const rowKeyName = get(recordCreatorProps, ["record", "rowKeyName"], "id");
        return { ...recordCreatorProps.record, [rowKeyName]: `edit-${index}` };
      },
    } as EditTableProps["recordCreatorProps"];
  }, [recordCreatorProps]);

  return (
    <EditableProTable editable={reEditable} recordCreatorProps={reRecordCreatorProps} {...reOptions} {...otherProps} />
  );
};

export interface HighEditTableProps extends EditTableProps, HighProps {}

export const HighEditTable = (props: HighEditTableProps) => {
  return <ComponentWrapper Component={EditTable} {...props} />;
};

interface FormEditTableItemProps extends ProFormFieldItemProps<EditTableProps> {}

const FormEditTableItem = ({ fieldProps, ...otherProps }: FormEditTableItemProps) => {
  return (
    <ProForm.Item {...otherProps}>
      <EditTable {...fieldProps} />
    </ProForm.Item>
  );
};

export const HighFormEditTableItem = (props: FormEditTableItemProps & HighProps) => {
  return <ComponentWrapper Component={FormEditTableItem} {...props} />;
};
