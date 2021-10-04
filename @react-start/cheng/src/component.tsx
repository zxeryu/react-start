import React, { CSSProperties, HTMLProps, ReactNode } from "react";
import {
  Button,
  Dialog as DialogOrigin,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
} from "@material-ui/core";

export const Item = ({ label, style, ...otherProps }: HTMLProps<HTMLDivElement> & { label?: ReactNode }) => {
  return (
    <div
      className={"NormalItem"}
      style={{
        cursor: "pointer",
        ...style,
      }}
      {...otherProps}>
      {label}
    </div>
  );
};

export const Title = ({ label, style }: { label?: ReactNode; style?: CSSProperties }) => {
  return <div style={{ fontSize: 16, fontWeight: 400, ...style }}>{label}</div>;
};

export const SubTitle = ({ label, style }: { label?: ReactNode; style?: CSSProperties }) => {
  return (
    <div className={"SubTitle"} style={{ fontSize: 14, fontWeight: 600, ...style }}>
      {label}
    </div>
  );
};

export const Dialog = ({
  title,
  onClose,
  onOk,
  noFooter,
  outClosable = true,
  children,
  ...props
}: Omit<DialogProps, "onClose"> & {
  title?: string;
  onClose?: () => void;
  onOk?: () => void;
  noFooter?: boolean;
  outClosable?: boolean;
}) => {
  return (
    <DialogOrigin
      fullWidth
      maxWidth={"sm"}
      onClose={outClosable ? onClose : undefined}
      css={{
        ".MuiDialog-container": {
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          paddingTop: 60,
        },
      }}
      {...props}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      {!noFooter && (
        <DialogActions>
          <Button variant={"outlined"} onClick={() => onClose && onClose()}>
            取消
          </Button>
          <Button variant={"contained"} onClick={() => onOk && onOk()}>
            确定
          </Button>
        </DialogActions>
      )}
    </DialogOrigin>
  );
};
