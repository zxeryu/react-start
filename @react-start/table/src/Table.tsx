import React from "react";
import RCTable from "rc-table";
import { tableStyle } from "./style";
import { TableProps as RCTableProps } from "rc-table/es/Table";
import { ExpandableConfig } from "rc-table/es/interface";
import { expandIcon } from "./ExpandIcon";

export interface TableProps<RecordType> extends RCTableProps<RecordType> {}

export const Table = <RecordType extends object = any>({ expandable, ...otherProps }: TableProps<RecordType>) => {
  const mergedExpandable: ExpandableConfig<RecordType> = {
    ...expandable,
  };

  if (!mergedExpandable.expandIcon) {
    mergedExpandable.expandIcon = expandIcon;
  }
  if (!mergedExpandable.columnWidth) {
    mergedExpandable.columnWidth = 60;
  }

  return (
    <div style={{ clear: "both", maxWidth: "100%" }}>
      <RCTable {...{ css: tableStyle }} {...otherProps} expandable={mergedExpandable} />
    </div>
  );
};
