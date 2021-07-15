import React, { Key, ReactNode, useCallback, useMemo } from "react";
import RCTable from "rc-table";
import { tableStyle } from "./style";
import { TableProps as RCTableProps, INTERNAL_HOOKS } from "rc-table/lib/Table";
import { ColumnsType, GetRowKey } from "rc-table/lib/interface";
import { expandIcon } from "./ExpandIcon";
import { useSelection } from "./useSelection";
import { isFunction, get, forEach, size, slice } from "lodash";
import { PaginationProps, Pagination } from "@react-start/components";
import { usePagination } from "./usePagination";
import { Stack } from "@material-ui/core";

export type TransformColumns<RecordType> = (columns: ColumnsType<RecordType>) => ColumnsType<RecordType>;

export interface TableRowSelection<T> {
  selectedRowKeys?: Key[];
  defaultSelectedRowKeys?: Key[];
  onChange?: (selectedRowKeys: Key[], selectedRows: T[]) => void;
  columnWidth?: string | number;
  columnTitle?: string | ReactNode;
}

export interface TableProps<RecordType>
  extends Omit<RCTableProps<RecordType>, "transformColumns" | "internalHooks" | "data"> {
  rowSelection?: TableRowSelection<RecordType>;
  pagination?: PaginationProps;
  dataSource?: RecordType[];
}

export const Table = <RecordType extends object = any>({
  expandable,
  rowSelection,
  pagination,
  rowKey,
  dataSource = [],
  ...otherProps
}: TableProps<RecordType>) => {
  // ============================ RowKey ============================
  const getRowKey = useMemo<GetRowKey<RecordType>>(() => {
    if (isFunction(rowKey)) {
      return rowKey;
    }
    return (record: RecordType) => get(record, rowKey!);
  }, [rowKey]);

  const recordMap = useMemo(() => {
    const kvMap = new Map<Key, RecordType>();
    forEach(dataSource, (record) => {
      const rowKey = getRowKey(record);
      kvMap.set(rowKey, record);
    });
    return kvMap;
  }, [dataSource, getRowKey]);

  const getRecordByKey = useCallback(
    (key: Key): RecordType => {
      return recordMap.get(key)!;
    },
    [recordMap],
  );

  // ============================ expandable ============================
  const mergedExpandable = useMemo(() => {
    if (!expandable) {
      return undefined;
    }
    const mergedExpandable = { ...expandable };
    if (!mergedExpandable.expandIcon) {
      mergedExpandable.expandIcon = expandIcon;
    }
    if (!mergedExpandable.columnWidth) {
      mergedExpandable.columnWidth = 60;
    }
    return mergedExpandable;
  }, [expandable]);

  // ========================== Pagination ==========================
  const [mergedPagination] = usePagination(size(dataSource), pagination);

  // ========================== Data ==========================
  const pageData = useMemo<RecordType[]>(() => {
    if (!pagination) {
      return dataSource;
    }

    const { page, total, pageSize } = mergedPagination;

    if (size(dataSource) < total!) {
      if (size(dataSource) > pageSize!) {
        return slice(dataSource, (page! - 1) * pageSize!, page! * pageSize!);
      }
      return dataSource;
    }

    return slice(dataSource, (page! - 1) * pageSize!, page! * pageSize!);
  }, [pagination, mergedPagination, dataSource]);

  // ========================== Selections ==========================
  const [selectionTransformColumns] = useSelection(rowSelection, {
    getRowKey,
    getRecordByKey,
    pageData,
  });

  const transformColumns = useCallback(
    (innerColumns: ColumnsType<RecordType>): ColumnsType<RecordType> => {
      return selectionTransformColumns(innerColumns);
    },
    [selectionTransformColumns],
  );

  return (
    <div style={{ clear: "both", maxWidth: "100%" }}>
      <RCTable
        {...{ css: tableStyle }}
        {...otherProps}
        data={pageData}
        rowKey={getRowKey}
        expandable={mergedExpandable}
        internalHooks={INTERNAL_HOOKS}
        transformColumns={transformColumns}
      />
      <Stack direction={"row"} style={{ justifyContent: "space-between", alignItems: "center", padding: "8px 10px" }}>
        <div />
        {pagination && size(pageData) > 0 && <Pagination shape="rounded" {...mergedPagination} />}
      </Stack>
    </div>
  );
};
