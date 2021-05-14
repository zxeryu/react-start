import React, { useEffect, useRef, useState } from "react";
import { TextField, Drawer, TextFieldProps } from "@material-ui/core";
import { CascadeProps, Picker, PickerProps } from "./Picker";
import { join, isString, get, forEach, size, findIndex, map } from "lodash";
import { PickerObjectOption, PickerOption } from "./Column";
import { useNextEffect } from "@react-start/hooks";

export const getValue = (
  mode: PickerProps["mode"] = "single",
  columns: PickerProps["columns"],
  is: number[],
): {
  labels: string[];
  values: (string | number)[];
} => {
  if (mode === "single") {
    const item = (columns as PickerOption[])[is[0]];
    const l = get(item, "label");
    const v = get(item, "value");
    return {
      labels: [isString(item) ? item : l?.toString()],
      values: [v],
    };
  } else if (mode === "multi") {
    const ls: string[] = [];
    const vs: string[] = [];
    forEach(columns as PickerOption[][], (c, i) => {
      const item = c[is[i]];
      const l = get(item, "label");
      const v = get(item, "value");

      ls.push(isString(item) ? item : l?.toString());
      vs.push(v);
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
    let tempCascade: CascadeProps = (columns as CascadeProps[])[is[index]];

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
    const index = findIndex(columns as PickerObjectOption[], (c) => c.value === values[0]);
    return [index];
  } else if (mode === "multi") {
    return map(columns as PickerObjectOption[][], (cs, index) => {
      return findIndex(cs, (c) => c.value === values[index]);
    });
  } else {
    const is: number[] = [];

    const len = size(values);
    let index = 0;

    let tempCascade = columns as CascadeProps[];

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
  onPickerChange,
  //
  round = true,
  //
  ...pickerProps
}: Omit<PickerProps, "onChange" | "value"> & {
  textFieldProps?: TextFieldProps;
  onChange?: (values: (string | number)[], labels: string[], indexs: number[]) => void;
  onPickerChange?: (values: (string | number)[], labels: string[], indexs: number[]) => void;
  value?: (string | number)[];
  round?: boolean;
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
        size={"small"}
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
              onChange && onChange(values, labels, v);

              setOpen(false);
            }}
            onChange={(v) => {
              const { labels, values } = getValue(pickerProps.mode, pickerProps.columns, v);
              onPickerChange && onPickerChange(values, labels, v);
            }}
          />
        </div>
      </Drawer>
    </>
  );
};
