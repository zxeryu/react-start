import React from "react";
import { RenderExpandIconProps } from "rc-table/lib/interface";
import { IconButton } from "@material-ui/core";
import { Add as AddIcon, Remove as RemoveIcon } from "@material-ui/icons";

export const expandIcon = <RecordType extends object = any>({
  onExpand,
  record,
  expanded,
  expandable,
}: RenderExpandIconProps<RecordType>) => {
  if (!expandable) {
    return null;
  }

  return (
    <IconButton
      style={{ padding: 2 }}
      onClick={(e) => {
        e.stopPropagation();
        onExpand(record, e);
      }}>
      {expanded ? <RemoveIcon fontSize={"small"} /> : <AddIcon fontSize={"small"} />}
    </IconButton>
  );
};
