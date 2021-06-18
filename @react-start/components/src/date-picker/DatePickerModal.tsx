import React, { useRef, useState } from "react";
import { useNextEffect } from "@react-start/hooks";
import { Drawer, TextField, TextFieldProps } from "@material-ui/core";
import { DatePicker, DatePickerProps } from "./DatePicker";

export const DatePickerModal = ({
  textFieldProps,
  round = true,
  //
  value,
  onConfirm,
  onCancel,
  ...datePickerProps
}: { textFieldProps?: TextFieldProps; round?: boolean } & DatePickerProps) => {
  const [open, setOpen] = useState<boolean>(false);

  const inputRef = useRef<HTMLDivElement>(null);

  useNextEffect(() => {
    !open && inputRef.current!.blur();
  }, [open]);

  return (
    <>
      <TextField
        inputRef={inputRef}
        fullWidth
        value={value}
        onClick={() => {
          setOpen(true);
        }}
        {...textFieldProps}
      />
      <Drawer
        open={open}
        anchor={"bottom"}
        onClose={() => setOpen(false)}
        PaperProps={{ style: round ? { borderTopLeftRadius: 15, borderTopRightRadius: 15 } : undefined }}>
        <div>
          <DatePicker
            value={value}
            {...datePickerProps}
            onCancel={() => {
              onCancel && onCancel();
              setOpen(false);
            }}
            onConfirm={(value) => {
              onConfirm && onConfirm(value);
              setOpen(false);
            }}
          />
        </div>
      </Drawer>
    </>
  );
};
