import React, { Key, ReactNode, useCallback, useMemo, useState } from "react";
import {
  Table as TableOrigin,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableSortLabel,
  Paper,
  Stack,
  Checkbox,
  TableCellProps,
  TableRowProps,
  TableProps as TableOriginProps,
  TableSortLabelProps,
  PaperProps,
} from "@material-ui/core";
import { DefaultPageSize, Pagination, PaginationProps } from "../pagination";
import { get, map, isFunction, sortBy, reverse, some, every, size, findIndex, filter, slice } from "lodash";
import { Loading } from "../common/Loading";
import { NoData } from "../common/NoData";

export declare type DataIndex = string | number | (string | number)[];
export declare type GetRowKey<RecordType> = (record: RecordType, index?: number) => Key;

type BaseRecordType = { [prop: string]: any };

export interface ColumnType<RecordType extends BaseRecordType> {
  dataIndex?: DataIndex;
  title?: ReactNode;
  render?: (value: any, record: RecordType, index: number) => ReactNode;
  sort?: boolean;
  CellProps?: TableCellProps;
  HeadCellProps?: TableCellProps;
  ListCellProps?: TableCellProps;
}

export interface RowSectionProps<RecordType extends BaseRecordType> {
  selectedList: RecordType[];
  onSelectChange: (list: RecordType[]) => void;
}

export interface TableProps<RecordType extends BaseRecordType> extends TableOriginProps {
  columns?: ColumnType<RecordType>[];
  dataSource?: RecordType[];
  rowKey?: string | GetRowKey<RecordType>;
  sorter?: (
    dataSource: RecordType[],
    direction: TableSortLabelProps["direction"],
    dataIndex: DataIndex,
  ) => RecordType[];
  onSortChange?: (direction: TableSortLabelProps["direction"], dataIndex: DataIndex) => void;
  pagination?: PaginationProps;
  rowSection?: RowSectionProps<RecordType>;
  orderNumber?: boolean;
  loading?: boolean;
  TableRowProps?: TableRowProps;
  PaperProps?: PaperProps;
  footer?: ReactNode;
}

const OrderNumberDataIndex = "orderNumber$";

const createOrderNumberColumn = (pageSize = DefaultPageSize, page = 1) => ({
  title: "序号",
  dataIndex: OrderNumberDataIndex,
  render: (_: unknown, _2: unknown, index: number) => {
    return (page - 1) * pageSize + index + 1;
  },
});

export const Table = <RecordType extends BaseRecordType>({
  columns = [],
  dataSource,
  rowKey,
  rowSection,
  pagination: paginationOrigin,
  //
  sorter,
  onSortChange,
  //
  orderNumber,
  loading,
  //
  TableRowProps,
  PaperProps,
  //
  footer,
  ...tableProps
}: TableProps<RecordType>) => {
  const getRecordID = useCallback(
    (record: RecordType, index?: number) => {
      if (!rowKey) {
        return undefined;
      }
      if (isFunction(rowKey)) {
        return rowKey(record, index);
      }
      return get(record, rowKey);
    },
    [rowKey],
  );

  const [sort, setSort] = useState<{
    direction: TableSortLabelProps["direction"];
    dataIndex: DataIndex;
  }>();

  const [pagination, setPagination] = useState<{ page: number; pageSize: number }>({
    page: paginationOrigin?.page || 1,
    pageSize: paginationOrigin?.pageSize || DefaultPageSize,
  });

  const supportCheck = useMemo(() => !!rowSection, [rowSection]);

  const newColumns = useMemo(() => {
    const newColumns = [...columns];
    if (orderNumber) {
      const index = findIndex(newColumns, (c) => c.dataIndex === OrderNumberDataIndex);
      if (index === -1) {
        newColumns.unshift(createOrderNumberColumn(pagination?.pageSize, pagination?.page));
      }
    }
    return newColumns;
  }, [columns, orderNumber, pagination?.page, pagination?.pageSize]);

  const newDataSource = useMemo(() => {
    //页数
    const page = pagination?.page || 1;
    const pageSize = pagination?.pageSize || DefaultPageSize;
    const data = slice(dataSource, (page - 1) * pageSize, Math.min(page * pageSize, size(dataSource)));

    //排序
    if (sort && !onSortChange) {
      if (sorter) {
        return sorter(data!, sort.direction, sort.dataIndex);
      }
      let list = sortBy(data, (item) => get(item, sort.dataIndex));
      if (sort.direction === "desc") {
        list = reverse(list);
      }
      return list;
    }
    return data;
  }, [dataSource, sort, pagination?.pageSize, pagination?.page]);

  const { checked, indeterminate } = useMemo(() => {
    if (size(rowSection?.selectedList) <= 0 || size(newDataSource) <= 0) {
      return { checked: false, indeterminate: false };
    }
    const checked = every(
      newDataSource,
      (item) => findIndex(rowSection!.selectedList, (d) => getRecordID(d) === getRecordID(item)) > -1,
    );
    const indeterminate = checked
      ? false
      : some(
          rowSection!.selectedList,
          (item) => findIndex(newDataSource, (d) => getRecordID(d) === getRecordID(item)) > -1,
        );
    return { checked, indeterminate };
  }, [rowSection, newDataSource]);

  return (
    <Paper style={{ position: "relative", minHeight: 200 }} {...PaperProps}>
      <TableContainer>
        <TableOrigin size={supportCheck ? "small" : undefined} {...tableProps}>
          <TableHead>
            <TableRow>
              {supportCheck && (
                <TableCell>
                  <Checkbox
                    checked={checked}
                    indeterminate={indeterminate}
                    onChange={(e) => {
                      if (e.target.checked) {
                        //add current dataSource
                        const notAddList = filter(
                          newDataSource,
                          (item) =>
                            findIndex(rowSection!.selectedList, (d) => getRecordID(d) === getRecordID(item)) === -1,
                        );
                        rowSection?.onSelectChange([...rowSection!.selectedList, ...notAddList]);
                      } else {
                        //remove current dataSource
                        const result = filter(
                          rowSection!.selectedList,
                          (item) => findIndex(newDataSource, (s) => getRecordID(s) === getRecordID(item)) > -1,
                        );
                        rowSection?.onSelectChange(result);
                      }
                    }}
                  />
                </TableCell>
              )}
              {map(newColumns, (column) => {
                let node: ReactNode;
                if (column.sort) {
                  node = (
                    <TableSortLabel
                      key={column.dataIndex as Key}
                      active={column.dataIndex === sort?.dataIndex}
                      direction={column.dataIndex === sort?.dataIndex ? sort?.direction : "asc"}
                      onClick={() => {
                        if (!column.dataIndex) {
                          return;
                        }
                        const direction = sort?.direction === "asc" ? "desc" : "asc";
                        setSort({ direction, dataIndex: column.dataIndex });
                        onSortChange && onSortChange(direction, column.dataIndex);
                      }}>
                      {column.title}
                    </TableSortLabel>
                  );
                }
                return (
                  <TableCell key={column.dataIndex as Key} {...column.CellProps} {...column.HeadCellProps}>
                    {node || column.title}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {map(newDataSource, (data, index) => {
              const rKey = getRecordID(data, index);
              return (
                <TableRow key={rKey} {...TableRowProps}>
                  {supportCheck && (
                    <TableCell>
                      <Checkbox
                        checked={some(rowSection?.selectedList, (item) => getRecordID(item) === getRecordID(data))}
                        onChange={(e) => {
                          if (e.target.checked) {
                            rowSection?.onSelectChange([...rowSection!.selectedList, data]);
                          } else {
                            rowSection?.onSelectChange(
                              filter(rowSection!.selectedList, (item) => getRecordID(item) !== getRecordID(data)),
                            );
                          }
                        }}
                      />
                    </TableCell>
                  )}
                  {map(newColumns, (column) => {
                    let cellItem: ReactNode;
                    if (isFunction(column.render)) {
                      cellItem = column.render(get(data, column.dataIndex || ""), data, index);
                    } else {
                      cellItem = get(data, column.dataIndex || "", "");
                    }
                    return (
                      <TableCell key={`${rKey}-${column.dataIndex}`} {...column.CellProps} {...column.ListCellProps}>
                        {cellItem}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </TableOrigin>
      </TableContainer>

      <Stack direction={"row"} style={{ justifyContent: "space-between", alignItems: "center" }}>
        {footer || <div />}
        {pagination && size(newDataSource) > 0 && (
          <Pagination
            style={{ padding: "8px 10px" }}
            shape="rounded"
            {...paginationOrigin}
            onChange={(page, pageSize) => {
              setPagination({ page, pageSize });
              paginationOrigin?.onChange && paginationOrigin.onChange(page, pageSize);
            }}
          />
        )}
      </Stack>

      {size(newDataSource) <= 0 && <NoData style={{ marginTop: 50 }} />}
      {loading && <Loading />}
    </Paper>
  );
};
