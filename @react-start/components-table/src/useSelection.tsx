import { TableRowSelection, TransformColumns } from "./Table";
import React, { ChangeEvent, Key, useCallback, useMemo } from "react";
import { ColumnsType, ColumnType, GetRowKey } from "rc-table/es/interface";
import { useControlState } from "@react-start/hooks";
import { Checkbox } from "@material-ui/core";
import { every, some, forEach, map } from "lodash";

export const useSelection = <RecordType extends object>(
  rowSelection: TableRowSelection<RecordType> | undefined,
  config: {
    getRowKey: GetRowKey<RecordType>;
    getRecordByKey: (key: Key) => RecordType;
    pageData: RecordType[];
  },
): [TransformColumns<RecordType>] => {
  const { columnWidth = 60, columnTitle, selectedRowKeys, defaultSelectedRowKeys, onChange } = rowSelection || {};
  const { getRowKey, getRecordByKey, pageData } = config;

  const [mergedSelectedKeys, setMergedSelectedKeys] = useControlState<Key[]>({
    value: selectedRowKeys,
    defaultValue: defaultSelectedRowKeys,
    onChange,
  });

  const selectionColumn: ColumnType<RecordType> | undefined = useMemo(() => {
    if (!rowSelection) {
      return undefined;
    }

    const keySet = new Set(mergedSelectedKeys);

    const recordKeys = map(pageData, getRowKey);

    const checkedCurrentAll = every(recordKeys, (key) => keySet.has(key));
    const checkedCurrentSome = checkedCurrentAll ? false : some(recordKeys, (key) => keySet.has(key));

    const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        forEach(recordKeys, (key) => {
          if (!keySet.has(key)) {
            keySet.add(key);
          }
        });
      } else {
        forEach(recordKeys, (key) => {
          keySet.delete(key);
        });
      }

      const finalKeys = Array.from(keySet);
      const records = map(finalKeys, (key) => getRecordByKey(key));
      setMergedSelectedKeys(finalKeys, records);
    };

    const render = (_: unknown, record: RecordType) => {
      const key = getRowKey(record);
      const checked = keySet.has(key);

      return (
        <Checkbox
          style={{ padding: 2 }}
          checked={checked}
          onChange={(e) => {
            if (e.target.checked) {
              keySet.add(key);
            } else {
              keySet.delete(key);
            }

            const finalKeys = Array.from(keySet);
            const records = map(finalKeys, (key) => getRecordByKey(key));
            setMergedSelectedKeys(finalKeys, records);
          }}
        />
      );
    };

    return {
      width: columnWidth,
      className: `ant-table-selection-column`,
      title: columnTitle || (
        <Checkbox
          style={{ padding: 2 }}
          checked={checkedCurrentAll}
          indeterminate={checkedCurrentSome}
          onChange={handleCheck}
        />
      ),
      render,
    };
  }, [rowSelection, mergedSelectedKeys, pageData]);

  const transformColumns = useCallback(
    (columns: ColumnsType<RecordType>): ColumnsType<RecordType> => {
      if (!selectionColumn) {
        return columns;
      }
      return [selectionColumn, ...columns];
    },
    [selectionColumn],
  );

  return [transformColumns];
};
