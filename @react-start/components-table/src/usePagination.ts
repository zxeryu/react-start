import { PaginationProps, DefaultPageSize } from "@react-start/components";
import { useState } from "react";

export const usePagination = (
  total: number,
  pagination: PaginationProps | undefined,
): [PaginationProps, (page: number, pageSize: number) => void] => {
  const { total: paginationTotal = 0, ...otherPagination } = pagination || {};

  const [innerPagination, setInnerPagination] = useState<{ page: number; pageSize: number }>(() => ({
    page: otherPagination.page || otherPagination.defaultPage || 1,
    pageSize: otherPagination.pageSize || DefaultPageSize,
  }));

  const mergedPagination: PaginationProps = {
    ...innerPagination,
    ...otherPagination,
    total: paginationTotal > 0 ? paginationTotal : total,
  };

  const refreshPagination = (page = 1, pageSize: number) => {
    if (otherPagination?.onChange) {
      otherPagination?.onChange(page, pageSize);
    } else {
      setInnerPagination({
        page,
        pageSize: pageSize || mergedPagination.pageSize!,
      });
    }
  };

  mergedPagination.onChange = refreshPagination;

  // reset page if > data length
  const maxPage = Math.ceil((paginationTotal || total) / mergedPagination.pageSize!);
  if (mergedPagination.page! > maxPage) {
    mergedPagination.page = maxPage || 1;
  }

  return [mergedPagination, refreshPagination];
};
