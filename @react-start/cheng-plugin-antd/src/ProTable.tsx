import React, { useCallback, useMemo, useRef } from "react";
import Table, { ActionType, ProTableProps, EditableProTable } from "@ant-design/pro-table";
import { HighProps, useHighPage } from "@react-start/cheng-high";
import { ElementListProps } from "./types";
import { Space } from "antd";
import { TablePaginationConfig } from "antd/lib/table/interface";
import { EditableProTableProps } from "@ant-design/pro-table/es/components/EditableTable";

type ParamsType = Record<string, any>;

export interface HighTableProps extends ProTableProps<any, ParamsType>, HighProps {
  toolBarList?: ElementListProps;
  operateList?: ElementListProps;
}

export const useColumnsWithOperate = (
  columns?: HighTableProps["columns"],
  operateList?: ElementListProps,
): HighTableProps["columns"] => {
  const { renderElementList, sendEvent } = useHighPage();

  return useMemo(() => {
    if (!columns) {
      return columns;
    }
    return [
      ...columns,
      {
        title: "操作",
        valueType: "option",
        render: (_, record, index, action, schema) => {
          return (
            <Space>
              {renderElementList(operateList || [], {
                onSend: ({ type, payload }) => {
                  sendEvent({
                    type,
                    payload: { ...payload, record, index, action, schema },
                  });
                },
              })}
            </Space>
          );
        },
      },
    ];
  }, [columns, operateList]);
};

export const HighTable = ({ highConfig, onSend, toolBarList, operateList, columns, ...otherProps }: HighTableProps) => {
  const { renderElementList, getStateValues, sendEvent } = useHighPage();

  const actionRef = useRef<ActionType>();

  const handleToolBarRender = useCallback(() => {
    return renderElementList(toolBarList || [], {
      onSend: (action) => {
        sendEvent({ type: action.type, payload: { ...action.payload, table: actionRef.current } });
      },
    });
  }, [toolBarList]);

  const hColumns = useColumnsWithOperate(columns, operateList);

  const stateProps = getStateValues(highConfig?.receiveStateList, otherProps);

  const handleOnPageChange: TablePaginationConfig["onChange"] = useCallback((page, pageSize) => {
    //todo:: pro-table bug 执行两次
    const pageInfo = actionRef.current?.pageInfo;
    if (pageInfo?.current === page && pageInfo?.pageSize === pageSize) {
      return;
    }

    if (highConfig?.sendEventName) {
      sendEvent({ type: `${highConfig!.sendEventName}:pagination:onChange`, payload: { page, pageSize } });
    }
  }, []);

  const handleOnPageShowSizeChange: TablePaginationConfig["onShowSizeChange"] = useCallback((current, size) => {
    //todo:: pro-table bug 不改变也会执行
    const pageInfo = actionRef.current?.pageInfo;
    if (pageInfo?.current === current && pageInfo?.pageSize === size) {
      return;
    }

    if (highConfig?.sendEventName) {
      sendEvent({ type: `${highConfig!.sendEventName}:pagination:onShowSizeChange`, payload: { current, size } });
    }
  }, []);

  const getPagination = () => {
    if (otherProps.pagination === false) {
      return false;
    }
    return {
      ...otherProps.pagination,
      ...stateProps?.pagination,
      onChange: handleOnPageChange,
      onShowSizeChange: handleOnPageShowSizeChange,
    } as TablePaginationConfig;
  };

  return (
    <Table
      search={false}
      actionRef={actionRef}
      {...otherProps}
      columns={hColumns}
      toolBarRender={otherProps.toolBarRender || handleToolBarRender}
      {...stateProps}
      pagination={getPagination()}
    />
  );
};

export interface HighEditTableProps extends EditableProTableProps<any, ParamsType>, HighProps {
  operateList?: ElementListProps;
}

export const HighEditTable = ({ highConfig, onSend, operateList, columns, ...otherProps }: HighEditTableProps) => {
  const { getStateValues, sendEventSimple } = useHighPage();

  const hColumns = useColumnsWithOperate(columns, operateList);

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
