import React, { useMemo, useRef } from "react";
import { Stack, Pagination as PaginationOrigin, PaginationProps as PaginationOriginProps } from "@material-ui/core";
import { isNumber } from "lodash";
import { Select } from "../input";
import { map } from "lodash";
import { useControlState } from "@react-start/hooks";

export interface PaginationProps extends Omit<PaginationOriginProps, "count" | "onChange"> {
  total?: number;
  pageSize?: number;
  showSizeChange?: boolean;
  pageSizeOptions?: number[];
  onChange?: (page: number, pageSize: number) => void;
}

export const DefaultPageSize = 10;

export const Pagination = ({
  total,
  showSizeChange,
  pageSizeOptions = [10, 20, 30, 50],
  page = 1,
  onChange,
  pageSize: paginationPageSize,
  style,
  ...props
}: PaginationProps) => {
  const pageRef = useRef<number>(1);
  const pageSizeRef = useRef<number>(DefaultPageSize);

  const [currentPage, setCurrentPage] = useControlState<number>({
    value: page,
    defaultValue: props.defaultPage,
    onChange: onChange
      ? (page) => {
          onChange(page, pageSizeRef.current!);
        }
      : undefined,
  });
  pageRef.current = currentPage!;

  const [pageSize, setPageSize] = useControlState<number>({
    value: paginationPageSize || DefaultPageSize,
    defaultValue: DefaultPageSize,
    onChange: onChange
      ? (pageSize) => {
          onChange(pageRef.current!, pageSize);
        }
      : undefined,
  });
  pageSizeRef.current = pageSize!;

  const paginationCount = useMemo(() => {
    if (!isNumber(total)) {
      return 1;
    }
    const int = parseInt((total / pageSize!) as any, 10);
    const remaining = total % pageSize!;
    if (int < 1) {
      return 1;
    }
    if (remaining > 0) {
      return int + 1;
    }
    return int;
  }, [total, pageSize]);

  return (
    <Stack direction={"row"} style={{ alignItems: "center", ...style }} spacing={0.5}>
      {total && (
        <span style={{ fontSize: 14 }}>{`第${(currentPage! - 1) * pageSize! + 1}-${Math.min(
          currentPage! * pageSize!,
          total,
        )}条/共${total}条`}</span>
      )}
      <PaginationOrigin
        {...props}
        page={currentPage}
        count={paginationCount}
        onChange={(_, page) => {
          setCurrentPage(page);
        }}
      />
      {showSizeChange && (
        <>
          <Select
            value={pageSize}
            size={"small"}
            options={map(pageSizeOptions, (item) => ({
              label: item,
              value: item,
            }))}
            MenuProps={{
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "center",
              },
            }}
            MenuItemProps={{
              style: { fontSize: 14 },
            }}
            style={{ height: 30, fontSize: 14 }}
            onChange={(e) => {
              const pageSize = e.target.value as number;
              setPageSize(pageSize);
            }}
          />
          <span style={{ fontSize: 14 }}>行/页</span>
        </>
      )}
    </Stack>
  );
};
