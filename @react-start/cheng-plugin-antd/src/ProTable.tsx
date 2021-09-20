import React, { useCallback, useMemo, useRef } from "react";
import Table, { ActionType, ProTableProps } from "@ant-design/pro-table";
import { HighConfig, useHighPage, useHigh, HighAction } from "@react-start/cheng-high";
import { ElementListProps } from "./types";
import { map, size } from "lodash";
import { Space } from "antd";

type ParamsType = Record<string, any>;

export interface HighTableProps extends ProTableProps<any, ParamsType, "text">, HighConfig {
  toolBarList?: ElementListProps;
  operateList?: ElementListProps;
}

export const HighTable = ({ highConfig, toolBarList, operateList, columns, ...otherProps }: HighTableProps) => {
  const { getElement } = useHigh();
  const { getStateValues, sendEvent } = useHighPage();

  const actionRef = useRef<ActionType>();

  const handleToolBarRender = useCallback(() => {
    if (!toolBarList || size(toolBarList) <= 0) {
      return [];
    }
    return map(toolBarList, (element, index) => {
      const El = getElement(element.elementType$);
      if (!El) {
        return null;
      }
      return (
        <El
          key={element.oid || `${element.elementType$}-${index}`}
          {...element.elementProps$}
          highConfig={{
            ...element.elementProps$?.highConfig,
            onSend: (action: HighAction) => {
              sendEvent({ type: action.type, payload: actionRef.current });
            },
          }}
        />
      );
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
        render: (_, record, i, action, schema) => {
          return (
            <Space>
              {map(operateList, (element, index) => {
                const El = getElement(element.elementType$);
                if (!El) {
                  return null;
                }
                return (
                  <El
                    key={element.oid || `${element.elementType$}-${index}`}
                    {...element.elementProps$}
                    highConfig={{
                      ...element.elementProps$?.highConfig,
                      onSend: ({ type }: HighAction) => {
                        sendEvent({
                          type,
                          payload: {
                            record,
                            index: i,
                            action,
                            schema,
                          },
                        });
                      },
                    }}
                  />
                );
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
