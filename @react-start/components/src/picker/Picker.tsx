import React, { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { map, size, isNumber, isArray, get } from "lodash";
import { Column } from "./Column";
import { Stack, CircularProgress, CircularProgressProps } from "@material-ui/core";
import { useNextEffect } from "@react-start/hooks";
import { Toolbar, ToolbarProps } from "../common/Toolbar";
import { IOption, ITreeOption } from "../type";

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

type Mode = "cascade" | "multi" | "single";

type SingleColumns = IOption[];
type MultiColumns = IOption[][];
type CascadeColumns = ITreeOption[];

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
  //直接触发onChange事件 级联模式
  directChange?: boolean;
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
  directChange,
  //
  ...toolbarProps
}: PickerProps) => {
  const [showColumns, setShowColumns] = useState<IOption[][]>([]);
  const showColumnsRef = useRef<IOption[][]>(showColumns);
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

  const changeRef = useRef<boolean>(false);

  const getCurrentValue = useCallback(
    (vs?: number[]) => {
      const values = vs || valueRef.current;
      if (size(values) <= 0) {
        return map(showColumnsRef.current, () => 0);
      }

      if (mode === "cascade") {
        const is: number[] = [];
        let index = 0;
        let tempColumn = (columns as ITreeOption[])[values[index]];
        let flag = true;

        while (flag) {
          is.push(values[index] || 0);
          index++;
          if (size(tempColumn?.children) > 0) {
            tempColumn = tempColumn.children![values[index]];
          } else {
            flag = false;
          }
        }

        return is;
      }

      const lastValue = map(values, (i) => (isNumber(i) ? i : 0));
      return map(showColumnsRef.current, (_, index) => lastValue[index]);
    },
    [columns],
  );

  const setColumns = useCallback(() => {
    if (!columns) {
      return null;
    }
    if (mode === "single") {
      setShowColumns([columns as SingleColumns]);
    } else if (mode === "multi") {
      setShowColumns(columns as MultiColumns);
    } else {
      const cs: IOption[][] = [];

      let index = 0;
      let tempColumns = columns as ITreeOption[];
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
          for (let i = index + 1; i < lastValueRef.current.length; i++) {
            lastValueRef.current[i] = 0;
          }
        }
      }

      setShowColumns(cs);
      if (indexChangeFlag || !selectValue || size(selectValue) <= 0) {
        setSelectValue([...lastValueRef.current]);
      }

      if (changeRef.current) {
        onChange && onChange(getCurrentValue());
      }

      if (directChange && !changeRef.current) {
        onChange && onChange(getCurrentValue(lastValueRef.current));
      }

      changeRef.current = true;
    }
  }, [columns]);

  useEffect(() => {
    setColumns();
  }, [columns]);

  useNextEffect(() => {
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
                const opeColumn = showColumnsRef.current[i][index] as IOption;
                //非最后一列筛选
                const prevIndexFlag = i < size(showColumnsRef.current) - 1;
                //最后一列，但是hasChild
                const lastIndexFlag = get(opeColumn, "hasChild");
                if (prevIndexFlag || lastIndexFlag) {
                  setColumns();
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
