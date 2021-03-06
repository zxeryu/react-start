import React, { ReactNode } from "react";

import { Button, Stack } from "@material-ui/core";

export interface ToolbarProps {
  cancelButtonText?: ReactNode;
  confirmButtonText?: ReactNode;
  title?: ReactNode;
  onSure?: () => void;
  onCancel?: () => void;
}

export const Toolbar = ({
  title = "",
  cancelButtonText = "取消",
  confirmButtonText = "确定",
  onSure,
  onCancel,
}: ToolbarProps) => {
  return (
    <Stack direction={"row"} style={{ justifyContent: "space-between", alignItems: "center" }}>
      <Button style={{ color: "grey" }} onClick={() => onCancel && onCancel()}>
        {cancelButtonText}
      </Button>
      <div
        style={{
          maxWidth: "50%",
          textAlign: "center",
        }}>
        {title}
      </div>
      <Button onClick={() => onSure && onSure()}>{confirmButtonText}</Button>
    </Stack>
  );
};
