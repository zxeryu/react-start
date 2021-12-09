/**
 * HighSearchForm
 * HighTable
 * HighModalForm
 * 组合成一个组件，核心就是columns的组成
 */

import React, { useMemo } from "react";
import { ModalForm, ModalFormProps, SearchForm, SearchFormProps } from "./ProForm";
import { Table, TableProps } from "./ProTable";
import { ComponentWrapper, ElementConfigBase, HighProps, useHighPage } from "@react-start/cheng-high";
import { GroupProps } from "@ant-design/pro-form/es/interface";
import { filter, map, get, omit, size, concat } from "lodash";
import { ProColumnType } from "@ant-design/pro-table/lib/typing";

type TColumns = Omit<ProColumnType, "search"> & {
  formElement?: ElementConfigBase;
  groupName?: string;
  //if true
  search?: boolean;
};

export interface CURDProps {
  searchProps: SearchFormProps;
  tableProps: TableProps;
  modalFormProps: ModalFormProps & {
    groupEnum?: { [key: string]: GroupProps };
    elementList?: ElementConfigBase[];
  };
  columns: TColumns[];
}

export const CURD = ({ columns, searchProps, tableProps, modalFormProps }: CURDProps) => {
  const { render } = useHighPage();

  const searchElement: ElementConfigBase[] = useMemo(() => {
    const validColumns = filter(columns, (column) => {
      return column.search && column.formElement;
    });
    return map(validColumns as TColumns[], (column) => {
      const oid = get(column, ["formElement", "oid"]);
      const elementType$ = get(column, ["formElement", "elementType$"]);
      const elementProps$ = get(column, ["formElement", "elementProps$"]);

      return {
        oid: `search-${elementType$}-${column.dataIndex}-${oid || ""}`,
        elementType$,
        elementProps$: {
          name: column.dataIndex,
          label: column.title,
          //去除rules验证
          ...omit(elementProps$, "rules"),
        },
      };
    });
  }, [columns]);

  const tableColumns = useMemo(() => {
    return filter(columns, (column) => {
      return !column.hideInTable;
    });
  }, [columns]);

  const formElement: ElementConfigBase[] = useMemo(() => {
    const validColumns = filter(columns, (column) => {
      return !column.hideInForm && column.formElement;
    });
    const columnElements = map(validColumns as TColumns[], (column) => {
      const oid = get(column, ["formElement", "oid"]);
      const elementType$ = get(column, ["formElement", "elementType$"]);
      const elementProps$ = get(column, ["formElement", "elementProps$"]);

      return {
        oid: `form-${elementType$}-${column.dataIndex}-${oid || ""}`,
        elementType$,
        elementProps$: {
          name: column.dataIndex,
          label: column.title,
          ...elementProps$,
        },
      };
    });
    return concat(columnElements, modalFormProps.elementList || []);
  }, [columns, modalFormProps.elementList]);

  return (
    <>
      {size(searchElement) > 0 && <SearchForm {...searchProps}>{render(searchElement)}</SearchForm>}
      <Table columns={tableColumns as ProColumnType[]} {...tableProps} />
      <ModalForm {...modalFormProps}>{render(formElement)}</ModalForm>
    </>
  );
};

export const HighCURD = (props: CURDProps & HighProps) => <ComponentWrapper Component={CURD} {...props} />;
