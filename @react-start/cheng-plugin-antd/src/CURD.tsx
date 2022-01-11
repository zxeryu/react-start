/**
 * HighSearchForm
 * HighTable
 * HighModalForm
 * 组合成一个组件，核心就是columns的组成
 */

import React, { ReactNode, useCallback, useMemo } from "react";
import { ModalForm, ModalFormProps, SearchForm, SearchFormProps } from "./ProForm";
import { Table, TableProps } from "./ProTable";
import { ComponentWrapper, ElementConfigBase, HighProps, useHighPage } from "@react-start/cheng-high";
import { filter, map, get, omit, size, forEach, isObject, set, isArray, reduce } from "lodash";
import { ProColumnType } from "@ant-design/pro-table/lib/typing";
import { GroupProps } from "@ant-design/pro-form/lib/interface";

const objToList = (obj: Record<string, any>, pathList: { path: string[]; value: any }[], path: string[]) => {
  forEach(obj, (v, k) => {
    const nextPath = [...path, k];
    if (!isObject(v) || isArray(v)) {
      pathList.push({ path: nextPath, value: v });
      return;
    }
    objToList(v, pathList, nextPath);
  });
};

type TColumns = Omit<ProColumnType, "search"> & {
  formElement?: ElementConfigBase;
  groupName?: string;
  //if true
  search?: boolean;
};

export interface CURDProps {
  searchProps?: SearchFormProps & {
    sort?: string[];
  };
  tableProps?: TableProps;
  modalFormProps?: ModalFormProps & {
    sort?: string[];
    groupSort?: { nameList: string[]; groupProps?: GroupProps }[];
  };
  //
  children?: ReactNode;
  /************************** 以下为抽取属性 **************************/
  columns: TColumns[];
  columnsMap?: Record<string, any>; //key为dataIndex，state兼容属性
  elementTypeMap?: Record<string, string>;
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
  columns: columnsOrigin,
  columnsMap = {},
  elementTypeMap = {},
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

  //根据valueType设置formElement
  const columns = useMemo(
    () =>
      map(columnsOrigin, (item) => {
        const nextItem = { ...item };
        const elementType$ = get(elementTypeMap, (item.valueType as string) || "text");
        if (!nextItem.formElement && elementType$ && !item.hideInForm) {
          nextItem.formElement = { oid: "", elementType$, elementProps$: {} };
        }

        //动态数据绑定
        const mapData = get(columnsMap, item.dataIndex!);
        if (isObject(mapData) && !isArray(mapData)) {
          const pathArr: { path: string[]; value: any }[] = [];
          objToList(mapData, pathArr, []);
          forEach(pathArr, ({ path, value }) => {
            set(nextItem, path, value);
          });
        }

        return nextItem;
      }),
    [columnsOrigin, columnsMap],
  );

  const tableColumns = useMemo(() => {
    return filter(columns, (column) => {
      return !column.hideInTable;
    });
  }, [columns]);

  const getElementConfig = useCallback((column: TColumns) => {
    const el = get(column, "formElement") as ElementConfigBase;
    const isSearch = column.search;

    const formItemProps = isSearch ? omit(column.formItemProps, "rules") : column.formItemProps;
    const elementProps$ = isSearch ? omit(el.elementProps$, "rules") : el.elementProps$;
    return {
      ...el,
      oid: `form-${el.elementType$}-${column.dataIndex}-${el.oid || ""}`,
      elementProps$: {
        name: column.dataIndex,
        label: column.title,
        fieldProps: column.fieldProps,
        ...formItemProps,
        ...elementProps$,
      },
    };
  }, []);

  const searchElement = useMemo(() => {
    const searchColumns = filter(columns, (column) => column.search && column.formElement);
    const elementList = map(searchColumns, (column) => getElementConfig(column as TColumns));
    //排序
    if (searchProps?.sort) {
      const elementMap = reduce(elementList, (pair, item) => ({ ...pair, [item.elementProps$.name]: item }), {});
      return map(searchProps.sort, (name) => get(elementMap, name));
    }
    return elementList;
  }, [columns]);

  const formElement = useMemo(() => {
    const modalColumns = filter(columns, (column) => !column.hideInForm && column.formElement);
    const elementList = map(modalColumns, (column) => getElementConfig(column as TColumns));

    //排序
    if (modalFormProps?.sort) {
      const elementMap = reduce(elementList, (pair, item) => ({ ...pair, [item.elementProps$.name]: item }), {});
      //group排序
      if (modalFormProps.groupSort) {
        const list: ElementConfigBase[] = [];
        forEach(modalFormProps.groupSort, ({ nameList, groupProps }, index) => {
          list.push({
            oid: `HighFormGroup-${index}`,
            elementType$: "HighFormGroup",
            elementProps$: { ...groupProps },
            elementList: map(nameList, (name) => get(elementMap, name)),
          });
        });
        return list;
      }
      return map(modalFormProps.sort, (name) => get(elementMap, name));
    }

    return elementList;
  }, [columns]);

  return (
    <>
      {size(searchElement) > 0 && (
        <SearchForm
          mode={"direct"}
          syncToUrl={syncToUrl}
          initEmit={initEmit}
          debounceKeys={debounceKeys}
          {...omit(searchProps, "sort")}>
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
        {...omit(modalFormProps, "sort", "groupSort")}
        modalProps={{ destroyOnClose, confirmLoading, ...modalFormProps?.modalProps }}>
        {render(formElement)}
        {children}
      </ModalForm>
    </>
  );
};

export const HighCURD = (props: CURDProps & HighProps) => <ComponentWrapper Component={CURD} {...props} />;
