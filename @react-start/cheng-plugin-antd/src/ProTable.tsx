import React, { useCallback, useMemo, useRef } from "react";
import Table, { ActionType, ProTableProps } from "@ant-design/pro-table";
import { HighConfig, useHighPage, useHigh, HighSendEvent } from "@react-start/cheng-high";
import { ElementListProps } from "./types";
import { size } from "lodash";
import { Space } from "antd";

type ParamsType = Record<string, any>;

export interface HighTableProps extends ProTableProps<any, ParamsType, "text">, HighConfig, HighSendEvent {
  toolBarList?: ElementListProps;
  operateList?: ElementListProps;
}

export const HighTable = ({ highConfig, toolBarList, operateList, columns, ...otherProps }: HighTableProps) => {
  const { renderElementList } = useHigh();
  const { getStateValues, sendEvent } = useHighPage();

  const actionRef = useRef<ActionType>();

  const handleToolBarRender = useCallback(() => {
    return renderElementList(toolBarList || [], {
      onSend: (action) => {
        sendEvent({ type: action.type, payload: actionRef.current });
      },
    });
  }, [toolBarList]);

  const hColumns: HighTableProps["columns"] = useMemo(() => {
    if (size(operateList) <= 0 || !columns) {
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
                onSend: ({ type }) => {
                  sendEvent({
                    type,
                    payload: { record, index, action, schema },
                  });
                },
              })}
            </Space>
          );
        },
      },
    ];
  }, [columns, operateList]);

  return (
    <Table
      search={false}
      actionRef={actionRef}
      {...otherProps}
      columns={hColumns}
      toolBarRender={otherProps.toolBarRender || handleToolBarRender}
      {...getStateValues(highConfig?.receiveStateList)}
    />
  );
};
