import React, { useEffect, useRef, useState } from "react";
import { TextField, Drawer, TextFieldProps } from "@material-ui/core";
import { Picker, PickerProps } from "./Picker";
import { join, get, forEach, size, findIndex, map } from "lodash";
import { useNextEffect } from "@react-start/hooks";
import { IOption, ITreeOption } from "../type";

export const getValue = (
  mode: PickerProps["mode"] = "single",
  columns: PickerProps["columns"],
  is: number[],
): {
  labels: string[];
  values: (string | number)[];
} => {
  if (mode === "single") {
    const item = (columns as IOption[])[is[0]];
    return {
      labels: [get(item, "label") as string],
      values: [get(item, "value")],
    };
  } else if (mode === "multi") {
    const ls: string[] = [];
    const vs: string[] = [];
    forEach(columns as IOption[][], (c, i) => {
      const item = c[is[i]];

      ls.push(get(item, "label") as string);
      vs.push(get(item, "value") as string);
    });
    return {
      labels: ls,
      values: vs,
    };
  } else {
    const ls: string[] = [];
    const vs: (string | number)[] = [];
    const len = size(is);
    let index = 0;
    let tempCascade: ITreeOption = (columns as ITreeOption[])[is[index]];

    while (index < len) {
      ls.push(tempCascade.label?.toString() as any);
      vs.push(tempCascade.value!);
      index++;
      if (index < len) {
        tempCascade = tempCascade.children![is[index]];
      }
    }
    return {
      labels: ls,
      values: vs,
    };
  }
};

export const getIndex = (
  mode: PickerProps["mode"] = "single",
  columns: PickerProps["columns"],
  values: (string | number)[],
) => {
  if (mode === "single") {
    const index = findIndex(columns as IOption[], (c) => c.value === values[0]);
    return [index];
  } else if (mode === "multi") {
    return map(columns as IOption[][], (cs, index) => {
      return findIndex(cs, (c) => c.value === values[index]);
    });
  } else {
    const is: number[] = [];

    const len = size(values);
    let index = 0;

    let tempCascade = columns as ITreeOption[];

    while (index < len) {
      const selectIndex = findIndex(tempCascade, (c) => c.value === values[index]);
      is.push(selectIndex);

      if (selectIndex > -1) {
        tempCascade = tempCascade[selectIndex].children!;
      }

      index++;
    }

    return is;
  }
};

export const PickerModal = ({
  textFieldProps,
  //
  value,
  onChange,
  onConfirm,
  //
  round = true,
  //
  ...pickerProps
}: Omit<PickerProps, "onChange" | "value" | "onConfirm"> & {
  textFieldProps?: TextFieldProps;
  round?: boolean;
  onChange?: (values: (string | number)[], labels: string[], indexs: number[]) => void;
  onConfirm?: (values: (string | number)[], labels: string[], indexs: number[]) => void;
  value?: (string | number)[];
}) => {
  const columnsRef = useRef<PickerProps["columns"]>(pickerProps.columns);
  columnsRef.current = pickerProps.columns;

  const [open, setOpen] = useState<boolean>(false);

  const [selectValue, setSelectValue] = useState<number[]>([]);

  const [showText, setShowText] = useState<string>("");
  const inputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value && columnsRef.current) {
      const is = getIndex(pickerProps.mode, columnsRef.current, value);
      setSelectValue(is);
    }
  }, [value]);

  useNextEffect(() => {
    !open && inputRef.current!.blur();
  }, [open]);

  return (
    <>
      <TextField
        inputRef={inputRef}
        value={showText}
        // disabled
        fullWidth
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
          <Picker
            {...pickerProps}
            onCancel={() => setOpen(false)}
            value={selectValue}
            onConfirm={(v) => {
              setSelectValue(v);
              const { labels, values } = getValue(pickerProps.mode, pickerProps.columns, v);
              setShowText(join(labels, ","));
              onConfirm && onConfirm(values, labels, v);

              setOpen(false);
            }}
            onChange={(v) => {
              const { labels, values } = getValue(pickerProps.mode, pickerProps.columns, v);
              onChange && onChange(values, labels, v);
            }}
          />
        </div>
      </Drawer>
    </>
  );
};
