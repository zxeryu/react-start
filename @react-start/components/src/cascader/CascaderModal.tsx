import React, { useRef, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Drawer from "@material-ui/core/Drawer";
import { useNextEffect } from "../../../hooks";
import { Cascader, CascaderProps } from "./Cascader";
import { TextFieldProps } from "@material-ui/core";
import { isString } from "lodash";

export const CascaderModal = ({
  textFieldProps,
  round = true,
  initTextLabel,
  ...cascaderProps
}: CascaderProps & { textFieldProps?: TextFieldProps; round?: boolean; initTextLabel?: string }) => {
  const [open, setOpen] = useState<boolean>(false);

  const inputRef = useRef<HTMLDivElement>(null);

  useNextEffect(() => {
    !open && inputRef.current!.blur();
  }, [open]);

  const [textValue, setTextValue] = useState<string>(initTextLabel || "");

  return (
    <>
      <TextField
        inputRef={inputRef}
        fullWidth
        onClick={() => {
          setOpen(true);
        }}
        value={textValue}
        {...textFieldProps}
      />
      <Drawer
        open={open}
        anchor={"bottom"}
        onClose={() => setOpen(false)}
        PaperProps={{ style: round ? { borderTopLeftRadius: 15, borderTopRightRadius: 15 } : undefined }}>
        <Cascader
          {...cascaderProps}
          onCancel={() => {
            cascaderProps.onCancel && cascaderProps.onCancel();
            setOpen(false);
          }}
          onConfirm={(v, option, options) => {
            cascaderProps.onConfirm && cascaderProps.onConfirm(v, option, options);
            isString(option?.label) && setTextValue(option!.label);
            setOpen(false);
          }}
        />
      </Drawer>
    </>
  );
};
