import React, { useEffect, useRef, useState } from "react";
import { useNextEffect } from "../../../hooks";
import { Cascader, CascaderProps } from "./Cascader";
import { TextFieldProps, TextField, Drawer } from "@material-ui/core";
import { isString, size, find, forEach, includes, map } from "lodash";
import { IOption } from "../type";

const getOptionByValue = (
  columns: CascaderProps["columns"],
  value: CascaderProps["value"],
  cb: (option: IOption | IOption[]) => void,
) => {
  if (Array.isArray(value)) {
    const result: CascaderProps["columns"] = [];
    forEach(columns, (item) => {
      if (includes(value, item.value)) {
        result.push(item);
      }
      if (size(result) === size(value)) {
        cb(result);
        return;
      }
      size(item.children) > 0 && getOptionByValue(item.children!, value, cb);
    });
  } else {
    const target = find(columns, (item) => item.value === value);
    if (target) {
      cb(target);
      return;
    }
    forEach(columns, (item) => {
      size(item.children) > 0 && getOptionByValue(item.children!, value, cb);
    });
  }
};

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

  //init show option
  useEffect(() => {
    if (size(cascaderProps.columns) <= 0 || !cascaderProps.value) {
      return;
    }
    getOptionByValue(cascaderProps.columns, cascaderProps.value, (option) => {
      console.log({ option });
      if (Array.isArray(option)) {
        setTextValue(map(option, (v) => v?.label).join(","));
      } else {
        isString(option?.label) && setTextValue(option?.label);
      }
    });
  }, []);

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
      {open && (
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
              if (Array.isArray(option)) {
                setTextValue(map(option, (v) => v?.label).join(","));
              } else {
                isString(option?.label) && setTextValue(option?.label || "");
              }
              // isString(option?.label) && setTextValue(option!.label);
              setOpen(false);
            }}
          />
        </Drawer>
      )}
    </>
  );
};
