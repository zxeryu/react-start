import React, { useCallback, useEffect, useMemo, useRef } from "react";
import ProTable, { ActionType, ProTableProps, EditableProTable } from "@ant-design/pro-table";
import { HighProps, useHighPage, ComponentWrapper } from "@react-start/cheng-high";
import { ElementListProps } from "./types";
import { Space } from "antd";
import { TablePaginationConfig } from "antd/lib/table/interface";
import { EditableProTableProps } from "@ant-design/pro-table/es/components/EditableTable";
import { useUrlSearchParams } from "@umijs/use-params";
import { get, map, size } from "lodash";
import { ProColumns } from "@ant-design/pro-table/lib/typing";

type ParamsType = Record<string, any>;

interface TableProps extends Omit<ProTableProps<any, ParamsType>, "actionRef"> {
  syncPageToUrl?: boolean;
  actionRef?: React.MutableRefObject<ActionType | undefined>;
}

export const useColumnsWithOperate = (
  columns?: HighTableProps["columns"],
  operateList?: ElementListProps,
  operateColumn?: HighTableProps["operateColumn"],
): HighTableProps["columns"] => {
  const { render, sendEvent } = useHighPage();

  return useMemo(() => {
    if (!columns) {
      return columns;
    }

    const reColumns = map(columns, (item) => {
      const elementConfig = get(item, "element");
      if (elementConfig) {
        item.render = (_, record, index) => {
          const value = get(record, item.dataIndex!);
          const key = record ? JSON.stringify(record) : Date.now().valueOf();
          elementConfig.elementProps$ = { ...elementConfig.elementProps$, ...item.fieldProps, value, record, index };
          return render({ ...elementConfig, oid: `${elementConfig.oid}-${index}-${key}-${item.dataIndex}` });
        };
      }
      return item;
    });

    if (size(operateList) > 0) {
      reColumns.push({
        title: "操作",
        valueType: "option",
        ...(operateColumn as any),
        render: (_, record, index, action, schema) => {
          const key = record ? JSON.stringify(record) : Date.now().valueOf();
          return (
            <Space>
              {map(operateList || [], (c) =>
                render(
                  { ...c, oid: `${c.oid}-${index}-${key}` },
                  {
                    onSend: ({ type, payload }) => {
                      sendEvent({
                        type,
                        payload: { ...payload, record, index, action, schema },
                      });
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

const Table = ({ actionRef: actionRefOrigin, syncPageToUrl, pagination, ...otherProps }: TableProps) => {
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
    const pageInfo = get(actionRefOrigin || actionRef, ["current", "pageInfo"]);
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
    const pageInfo = get(actionRefOrigin || actionRef, ["current", "pageInfo"]);
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

  return <ProTable actionRef={actionRefOrigin || actionRef} search={false} pagination={rePagination} {...otherProps} />;
};

export interface HighTableProps extends TableProps, HighProps {
  tableName?: string;
  toolBarList?: ElementListProps;
  operateList?: ElementListProps;
  operateColumn?: ProColumns<any, ParamsType>;
}

export const HighTable = ({
  tableName,
  actionRef: actionRefOrigin,
  columns,
  operateList,
  operateColumn,
  toolBarList,
  ...otherProps
}: HighTableProps) => {
  const { setDataToRef, render } = useHighPage();

  const actionRef = useRef<ActionType>();

  useEffect(() => {
    tableName && setDataToRef(tableName, actionRefOrigin ? actionRefOrigin.current : actionRef.current);
  }, []);

  const reColumns = useColumnsWithOperate(columns, operateList, operateColumn);

  return (
    <ComponentWrapper
      Component={Table}
      actionRef={actionRefOrigin || actionRef}
      columns={reColumns}
      toolBarRender={() => {
        if (!toolBarList) {
          return null;
        }
        return render(toolBarList);
      }}
      {...otherProps}
    />
  );
};

export interface HighEditTableProps extends EditableProTableProps<any, ParamsType>, HighProps {
  operateList?: ElementListProps;
  operateColumn?: ProColumns<any, ParamsType>;
}

export const HighEditTable = ({
  highConfig,
  onSend,
  operateList,
  operateColumn,
  columns,
  ...otherProps
}: HighEditTableProps) => {
  const { getStateValues, sendEventSimple } = useHighPage();

  const hColumns = useColumnsWithOperate(columns, operateList, operateColumn);

  const stateProps = getStateValues(highConfig?.receiveStateList, otherProps);

  return (
    <EditableProTable
      {...otherProps}
      columns={hColumns}
      {...stateProps}
      editable={{
        ...otherProps.editable,
        ...stateProps?.editable,
        onChange: (editableKeys, editableRows) => {
          sendEventSimple(highConfig, onSend, { key: "editable:onChange", payload: { editableKeys, editableRows } });
        },
        onValuesChange: (record, dataSource) => {
          sendEventSimple(highConfig, onSend, { key: "editable:onValuesChange", payload: { record, dataSource } });
        },
        onSave: (key, record, originRow, newLineConfig) => {
          sendEventSimple(highConfig, onSend, {
            key: "editable:onSave",
            payload: { key, record, originRow, newLineConfig },
          });
          return Promise.resolve();
        },
        onDelete: (key, row) => {
          sendEventSimple(highConfig, onSend, {
            key: "editable:onDelete",
            payload: { key, row },
          });
          return Promise.resolve();
        },
      }}
      onChange={(value) => {
        sendEventSimple(highConfig, onSend, { key: "onChange", payload: { value } });
      }}
    />
  );
};
