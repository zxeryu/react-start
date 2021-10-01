import React, { useCallback, useMemo, useRef } from "react";
import Table, { ActionType, ProTableProps, EditableProTable } from "@ant-design/pro-table";
import { HighProps, useHighPage } from "@react-start/cheng-high";
import { ElementListProps } from "./types";
import { Space } from "antd";
import { TablePaginationConfig } from "antd/lib/table/interface";
import { EditableProTableProps } from "@ant-design/pro-table/es/components/EditableTable";
import { useUrlSearchParams } from "@umijs/use-params";
import { get, map } from "lodash";
import { ProColumns } from "@ant-design/pro-table/lib/typing";

type ParamsType = Record<string, any>;

export interface HighTableProps extends ProTableProps<any, ParamsType>, HighProps {
  toolBarList?: ElementListProps;
  operateList?: ElementListProps;
  operateColumn?: ProColumns<any, ParamsType>;
  syncPageToUrl?: boolean;
}

export const useColumnsWithOperate = (
  columns?: HighTableProps["columns"],
  operateList?: ElementListProps,
  operateColumn?: HighTableProps["operateColumn"],
): HighTableProps["columns"] => {
  const { renderElement, sendEvent } = useHighPage();

  return useMemo(() => {
    if (!columns) {
      return columns;
    }
    return [
      ...columns,
      {
        title: "操作",
        valueType: "option",
        ...(operateColumn as any),
        render: (_, record, index, action, schema) => {
          const key = record ? JSON.stringify(record) : Date.now().valueOf();
          return (
            <Space>
              {map(operateList || [], (c) =>
                renderElement(
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
      },
    ];
  }, [columns, operateList, operateColumn]);
};

export const HighTable = ({
  highConfig,
  onSend,
  toolBarList,
  operateList,
  operateColumn,
  columns,
  syncPageToUrl,
  ...otherProps
}: HighTableProps) => {
  const [urlState, setUrlState] = useUrlSearchParams(
    syncPageToUrl
      ? {
          page: get(otherProps, ["pagination", "current"], 1),
          pageSize: get(otherProps, ["pagination", "pageSize"], 10),
        }
      : {},
  );

  const { renderElementList, getStateValues, sendEvent, sendEventSimple } = useHighPage();

  const actionRef = useRef<ActionType>();

  const handleToolBarRender = useCallback(() => {
    return renderElementList(toolBarList || [], {
      onSend: (action) => {
        sendEvent({ type: action.type, payload: { ...action.payload, table: actionRef.current } });
      },
    });
  }, [toolBarList]);

  const hColumns = useColumnsWithOperate(columns, operateList, operateColumn);

  const stateProps = getStateValues(highConfig?.receiveStateList, otherProps);

  const handleOnPageChange: TablePaginationConfig["onChange"] = useCallback((page, pageSize) => {
    //todo:: pro-table bug 执行两次
    const pageInfo = actionRef.current?.pageInfo;
    if (pageInfo?.current === page && pageInfo?.pageSize === pageSize) {
      return;
    }

    if (syncPageToUrl) {
      setUrlState({ page, pageSize });
    }

    sendEventSimple(highConfig, onSend, {
      key: "pagination:onChange",
      payload: { page, pageSize },
    });
  }, []);

  const handleOnPageShowSizeChange: TablePaginationConfig["onShowSizeChange"] = useCallback((current, size) => {
    //todo:: pro-table bug 不改变也会执行
    const pageInfo = actionRef.current?.pageInfo;
    if (pageInfo?.current === current && pageInfo?.pageSize === size) {
      return;
    }

    if (syncPageToUrl) {
      setUrlState({ page: current, pageSize: size });
    }

    sendEventSimple(highConfig, onSend, {
      key: "pagination:onShowSizeChange",
      payload: { current, size },
    });
  }, []);

  const handleReload = useCallback(() => {
    sendEventSimple(highConfig, onSend, {
      key: "reload",
      payload: { table: actionRef.current },
    });
  }, []);

  const getPagination = () => {
    if (otherProps.pagination === false) {
      return false;
    }
    return {
      ...otherProps.pagination,
      ...stateProps?.pagination,
      current: syncPageToUrl ? Number(urlState.page) : stateProps?.pagination?.current,
      pageSize: syncPageToUrl ? Number(urlState.pageSize) : stateProps?.pagination?.pageSize,
      onChange: handleOnPageChange,
      onShowSizeChange: handleOnPageShowSizeChange,
    } as TablePaginationConfig;
  };

  const reload = get(stateProps, ["options", "reload"]) || get(otherProps, ["options", "reload"]);

  return (
    <Table
      search={false}
      actionRef={actionRef}
      {...otherProps}
      columns={hColumns}
      toolBarRender={otherProps.toolBarRender || handleToolBarRender}
      {...stateProps}
      options={{
        ...otherProps.options,
        ...stateProps?.options,
        reload: reload ? handleReload : false,
      }}
      pagination={getPagination()}
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

  return (
    <EditableProTable
      {...otherProps}
      columns={hColumns}
      editable={{
        ...otherProps.editable,
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
      {...getStateValues(highConfig?.receiveStateList, otherProps)}
    />
  );
};
