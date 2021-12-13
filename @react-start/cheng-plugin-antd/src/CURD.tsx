/**
 * HighSearchForm
 * HighTable
 * HighModalForm
 * 组合成一个组件，核心就是columns的组成
 */

import React, { ReactNode, useMemo } from "react";
import { ModalForm, ModalFormProps, SearchForm, SearchFormProps } from "./ProForm";
import { Table, TableProps } from "./ProTable";
import { ComponentWrapper, ElementConfigBase, HighProps, useHighPage } from "@react-start/cheng-high";
import { GroupProps } from "@ant-design/pro-form/es/interface";
import { filter, map, get, omit, size } from "lodash";
import { ProColumnType } from "@ant-design/pro-table/lib/typing";

type TColumns = Omit<ProColumnType, "search"> & {
  formElement?: ElementConfigBase;
  groupName?: string;
  //if true
  search?: boolean;
};

export interface CURDProps {
  searchProps?: SearchFormProps;
  tableProps?: TableProps;
  modalFormProps?: ModalFormProps & {
    groupEnum?: { [key: string]: GroupProps };
  };
  //
  children?: ReactNode;
  /************************** 以下为抽取属性 **************************/
  columns: TColumns[];
  //search form
  syncToUrl?: SearchFormProps["syncToUrl"];
  initEmit?: SearchFormProps["initEmit"];
  debounceKeys?: SearchFormProps["debounceKeys"];
  //table
  syncPageToUrl?: TableProps["syncPageToUrl"];
  rowKey?: TableProps["rowKey"];
  loading?: TableProps["loading"];
  dataSource?: TableProps["dataSource"];
  total?: number;
  //modal form
  visible?: ModalFormProps["visible"];
  title?: ModalFormProps["title"];
  confirmLoading?: boolean;
  destroyOnClose?: boolean;
  modalLoading?: boolean;
}

export const CURD = ({
  searchProps,
  tableProps,
  modalFormProps,
  //
  children,
  //
  columns,
  //
  syncToUrl,
  initEmit,
  debounceKeys,
  //
  syncPageToUrl,
  rowKey,
  loading,
  dataSource,
  total,
  //
  visible,
  title,
  confirmLoading,
  destroyOnClose,
  modalLoading,
}: CURDProps) => {
  const { render } = useHighPage();

  const searchElement: ElementConfigBase[] = useMemo(() => {
    const validColumns = filter(columns, (column) => {
      return column.search && column.formElement;
    });
    return map(validColumns as TColumns[], (column) => {
      const el = get(column, "formElement") as ElementConfigBase;
      return {
        ...el,
        oid: `search-${el.elementType$}-${column.dataIndex}-${el.oid || ""}`,
        elementProps$: {
          name: column.dataIndex,
          label: column.title,
          //去除rules验证
          ...omit(el.elementProps$, "rules"),
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
    return map(validColumns as TColumns[], (column) => {
      const el = get(column, "formElement") as ElementConfigBase;
      return {
        ...el,
        oid: `form-${el.elementType$}-${column.dataIndex}-${el.oid || ""}`,
        elementProps$: {
          name: column.dataIndex,
          label: column.title,
          ...el.elementProps$,
        },
      };
    });
  }, [columns]);

  return (
    <>
      {size(searchElement) > 0 && (
        <SearchForm
          mode={"direct"}
          syncToUrl={syncToUrl}
          initEmit={initEmit}
          debounceKeys={debounceKeys}
          {...searchProps}>
          {render(searchElement)}
        </SearchForm>
      )}
      <Table
        columns={tableColumns as ProColumnType[]}
        syncPageToUrl={syncPageToUrl}
        rowKey={rowKey}
        loading={loading}
        dataSource={dataSource}
        {...tableProps}
        pagination={total ? { total, ...tableProps?.pagination } : tableProps?.pagination}
      />
      <ModalForm
        visible={visible}
        title={title}
        loading={modalLoading}
        {...modalFormProps}
        modalProps={{ destroyOnClose, confirmLoading, ...modalFormProps?.modalProps }}>
        {render(formElement)}
        {children}
      </ModalForm>
    </>
  );
};

export const HighCURD = (props: CURDProps & HighProps) => <ComponentWrapper Component={CURD} {...props} />;
