import React, { CSSProperties, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { map, size, isNumber, isArray } from "lodash";
import { PickerOption, Column, PickerObjectOption } from "./Column";
import { Button, Stack, CircularProgress, CircularProgressProps } from "@material-ui/core";

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
    <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
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

const PickerStyle: { [key: string]: CSSProperties } = {
  root: { position: "relative", userSelect: "none", backgroundColor: "white" },
  wrapper: { position: "relative", display: "flex", cursor: "grab" },
  wrapperMask: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
    width: "100%",
    height: "100%",
    backgroundImage: `linear-gradient(180deg,hsla(0, 0%, 100%, 0.9),hsla(0, 0%, 100%, 0.4)),linear-gradient(0deg, hsla(0, 0%, 100%, 0.9), hsla(0, 0%, 100%, 0.4))`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "top, bottom",
    transform: "translateZ(0)",
    pointerEvents: "none",
  },
  wrapperBorder: {
    position: "absolute",
    top: "50%",
    left: 16,
    right: 16,
    zIndex: 2,
    transform: "translateY(-50%)",
    pointerEvents: "none",
    borderTop: "1px solid #ebedf0",
    borderBottom: "1px solid #ebedf0",
  },
};

export type PickerFieldNames = {
  text?: string;
  values?: string;
  children?: string;
};

export interface CascadeProps {
  label: ReactNode;
  value?: string | number;
  disable?: boolean;
  children?: CascadeProps[];
}

type Mode = "cascade" | "multi" | "single";

type SingleColumns = PickerOption[];
type MultiColumns = PickerOption[][];
type CascadeColumns = CascadeProps[];

export interface PickerProps extends Omit<ToolbarProps, "onCancel" | "onSure"> {
  mode?: Mode;
  loading?: boolean;
  loadingProps?: CircularProgressProps;
  readonly?: boolean;
  showToolbar?: boolean;
  itemHeight?: number;
  visibleItemCount?: number;
  swipeDuration?: number;
  //
  columns?: SingleColumns | MultiColumns | CascadeColumns;
  //
  value?: number | number[];
  onChange?: (v: number[]) => void;
  onConfirm?: (v: number[]) => void;
  onCancel?: () => void;
  //
  style?: CSSProperties;
}

export const Picker = ({
  mode = "single",
  loading,
  loadingProps,
  readonly,
  showToolbar = true,
  itemHeight = 44,
  visibleItemCount = 6,
  swipeDuration = 1000,
  //
  columns,
  //
  value,
  onChange,
  onConfirm,
  onCancel,
  //
  style,
  //
  ...toolbarProps
}: PickerProps) => {
  const [showColumns, setShowColumns] = useState<PickerOption[][]>([]);
  const showColumnsRef = useRef<PickerOption[][]>(showColumns);
  showColumnsRef.current = showColumns;

  const [selectValue, setSelectValue] = useState<number[]>(() => {
    if (mode === "single") {
      return value ? ([value] as number[]) : [0];
    }
    return value ? (value as number[]) : [];
  });
  const valueRef = useRef<number[]>([]);
  valueRef.current = selectValue;
  const lastValueRef = useRef<number[]>([]);

  const getCurrentValue = useCallback(() => {
    if (size(valueRef.current) <= 0) {
      return map(showColumnsRef.current, () => 0);
    }

    if (mode === "cascade") {
      const is: number[] = [];
      let index = 0;
      let tempColumn = (columns as CascadeProps[])[valueRef.current[index]];
      let flag = true;

      while (flag) {
        is.push(valueRef.current[index] || 0);
        index++;
        if (size(tempColumn?.children) > 0) {
          tempColumn = tempColumn.children![valueRef.current[index]];
        } else {
          flag = false;
        }
      }

      return is;
    }

    const lastValue = map(valueRef.current, (i) => (isNumber(i) ? i : 0));
    return map(showColumnsRef.current, (_, index) => lastValue[index]);
  }, [columns]);

  const setColumns = useCallback(
    (change?: boolean) => {
      if (!columns) {
        return null;
      }
      if (mode === "single") {
        setShowColumns([columns]);
      } else if (mode === "multi") {
        setShowColumns(columns as MultiColumns);
      } else {
        const cs: PickerOption[][] = [];

        let index = 0;
        let tempColumns = columns as CascadeProps[];
        let flag = true;

        let indexChangeFlag = false;

        while (flag) {
          let tempSelectIndex = 0;

          if (indexChangeFlag) {
            tempSelectIndex = 0;
          } else if (isNumber(valueRef.current[index])) {
            tempSelectIndex = valueRef.current[index];
            if (isNumber(lastValueRef.current[index]) && valueRef.current[index] != lastValueRef.current[index]) {
              indexChangeFlag = true;
            }
          }
          lastValueRef.current[index] = tempSelectIndex;

          const os = map(tempColumns, (c) => ({
            label: c.label,
            value: c.value,
            hasChild: size(c.children) > 0,
          }));
          cs.push(os);

          if (size(tempColumns[tempSelectIndex]?.children) > 0) {
            tempColumns = tempColumns[tempSelectIndex].children!;
            index++;
          } else {
            flag = false;
          }
        }
        setShowColumns(cs);
        if (indexChangeFlag || !selectValue || size(selectValue) <= 0) {
          setSelectValue([...lastValueRef.current]);
        }
        if (change) {
          onChange && onChange(getCurrentValue());
        }
      }
    },
    [columns],
  );

  useEffect(() => {
    setColumns();
  }, [columns]);

  useEffect(() => {
    if (value) {
      if (isArray(value)) {
        size(value) > 0 && setSelectValue(value);
      } else {
        setSelectValue([value as number]);
      }
    }
  }, [value]);

  const { wrapHeight } = useMemo(() => {
    return {
      wrapHeight: itemHeight * +visibleItemCount,
    };
  }, [itemHeight, visibleItemCount]);

  //onConfirm callback
  const handleSure = useCallback(() => {
    onConfirm && onConfirm(getCurrentValue());
  }, [showColumns]);

  const handleCancel = useCallback(() => {
    onCancel && onCancel();
  }, []);

  return (
    <div style={{ ...PickerStyle.root, ...style }}>
      {showToolbar && <Toolbar {...toolbarProps} onSure={handleSure} onCancel={handleCancel} />}
      {loading && (
        <Stack
          alignItems={"center"}
          justifyContent={"center"}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            zIndex: 3,
            backgroundColor: "rgba(255, 255, 255, 0.6)",
          }}>
          <CircularProgress {...loadingProps} />
        </Stack>
      )}
      <div
        style={{ ...PickerStyle.wrapper, height: `${wrapHeight}px` }}
        onTouchMove={(e) => {
          e.stopPropagation();
        }}>
        {map(showColumns, (columns, i) => (
          <Column
            key={i}
            readonly={readonly}
            itemHeight={itemHeight}
            swipeDuration={swipeDuration}
            visibleItemCount={visibleItemCount}
            options={columns}
            index={selectValue[i] || 0}
            onChange={(index) => {
              setSelectValue((prevState) => {
                prevState[i] = index;
                return [...prevState];
              });

              if (mode === "cascade") {
                const opeColumn = showColumnsRef.current[i][index] as PickerObjectOption;
                //非最后一列筛选
                const prevIndexFlag = i < size(showColumnsRef.current) - 1;
                //最后一列，但是hasChild
                const lastIndexFlag = opeColumn && opeColumn.hasChild;
                if (prevIndexFlag || lastIndexFlag) {
                  setColumns(true);
                } else {
                  onChange && onChange(getCurrentValue());
                }
                return;
              }

              onChange && onChange(getCurrentValue());
            }}
          />
        ))}
        <div
          style={{
            ...PickerStyle.wrapperMask,
            backgroundSize: `100% ${(wrapHeight - itemHeight) / 2}px`,
          }}
        />
        <div
          style={{
            ...PickerStyle.wrapperBorder,
            height: `${itemHeight}px`,
          }}
        />
      </div>
    </div>
  );
};
