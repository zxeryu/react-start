import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";

import {
  Tabs,
  Tab,
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  IconButton,
} from "@material-ui/core";

// import CheckIcon from "@material-ui/icons/Check";
// import CloseIcon from "@material-ui/icons/Close";
import { Check as CheckIcon, Close as CloseIcon } from "@material-ui/icons";

import { IOption, ITreeOption, TValue } from "../type";
import { map, omit, get, slice, set, size, join, last, findIndex, filter, some } from "lodash";
import { Toolbar, ToolbarProps } from "../common/Toolbar";

type ResultCallback = (v: IOption["value"], option?: IOption | IOption[], options?: IOption[]) => void;

export interface CascaderProps extends Omit<ToolbarProps, "onCancel" | "onSure"> {
  showToolbar?: boolean;
  mode?: "child" | "parent" | "multiple";
  loading?: boolean;
  columns: ITreeOption[];
  value?: IOption["value"];
  onChange?: ResultCallback;
  onCancel?: () => void;
  onConfirm?: ResultCallback;
}

type ChooseType = IOption & { index: number };

interface ShowColumnOption {
  choose?: ChooseType | ChooseType[];
  column: IOption[];
}

const findTarget = (
  columns: ITreeOption[],
  targetValue: IOption["value"],
  targetList: ITreeOption[],
  resultList: ITreeOption[],
) => {
  for (let i = 0; i < columns.length; i++) {
    const item = columns[i];
    if (item.value === targetValue) {
      targetList.push(item);
      resultList.push(...targetList);
      return;
    }
  }
  for (let i = 0; i < columns.length; i++) {
    const parent = columns[i];
    if (size(parent.children) > 0) {
      findTarget(parent.children!, targetValue, [...targetList, parent], resultList);
    }
  }
};

export const Cascader = ({
  showToolbar = true,
  mode = "child",
  //
  title,
  cancelButtonText,
  confirmButtonText,
  //
  loading,
  columns,
  value,
  onChange,
  onCancel,
  onConfirm,
}: CascaderProps) => {
  const columnsRef = useRef<ITreeOption[]>(columns);
  columnsRef.current = columns;

  const [showColumns, setShowColumns] = useState<ShowColumnOption[]>([]);
  const showColumnsRef = useRef<ShowColumnOption[]>(showColumns);
  showColumnsRef.current = showColumns;

  const [currentTab, setCurrentTab] = useState<number>(0);

  const handleTabChange = useCallback((e, v) => {
    setCurrentTab(v);
  }, []);

  useEffect(() => {
    if (size(columns) <= 0) {
      return;
    }
    //初始值
    if (size(showColumnsRef.current) <= 0) {
      setShowColumns([{ column: map(columns, (c) => omit(c, "children")) }]);
      return;
    }
    //如果当前showColumns最后一列未选择，不更新
    const lastShowColumn = last(showColumnsRef.current);
    if (!lastShowColumn || !lastShowColumn.choose) {
      return;
    }
    //如果当前showColumns最后一列存在新children（from：columns），更新
    const path = join(
      map(showColumnsRef.current, ({ choose }) => (choose as ChooseType)!.index),
      ".children.",
    );
    const lastOption = get(columns, path);
    if (lastOption && size(lastOption.children) > 0) {
      setShowColumns((prev) => [
        ...prev,
        { column: map(lastOption.children, (c) => omit(c, "children")) as IOption[] },
      ]);
      setCurrentTab(size(showColumnsRef.current));
    }
  }, [columns]);

  const { currentColumn, currentChoose } = useMemo(
    () => ({
      currentColumn: get(showColumns, [currentTab, "column"], []),
      currentChoose: get(showColumns, [currentTab, "choose"], undefined),
    }),
    [showColumns, currentTab],
  );

  const selectItem = useCallback(
    (tabIndex, itemIndex) => {
      const nextShowColumns = slice(showColumns, 0, tabIndex + 1);
      const targetOption = get(nextShowColumns, [tabIndex, "column", itemIndex]);
      if (mode === "multiple" && get(targetOption, "isLeaf")) {
        const currentColumns = get(nextShowColumns, [tabIndex, "choose"], []) as ChooseType[];
        const waitColumns = { ...targetOption, index: itemIndex };
        const filterNextShowColumns = filter(currentColumns, (v) => v?.value === waitColumns?.value);
        if (filterNextShowColumns.length > 0) {
          set(nextShowColumns, "choose", [...filterNextShowColumns, waitColumns]);
        } else {
          set(nextShowColumns[tabIndex], "choose", [...currentColumns, waitColumns]);
        }
      } else {
        set(nextShowColumns[tabIndex], "choose", { ...targetOption, index: itemIndex });
      }
      const path = join(
        map(nextShowColumns, ({ choose }) => {
          return (choose as ChooseType)?.index;
        }),
        ".children.",
      );
      const targetTreeOption = get(columnsRef.current, path);
      if (targetTreeOption && size(targetTreeOption.children) > 0) {
        nextShowColumns.push({ column: targetTreeOption.children });
      }
      setShowColumns(nextShowColumns);
      setCurrentTab(size(nextShowColumns) - 1);

      const chooseList = filter(
        map(nextShowColumns, (c) => c.choose),
        (c) => !!c,
      );

      onChange && onChange(targetOption.value, targetOption, chooseList as IOption[]);

      //如果是叶子节点，执行onConfirm
      if (mode === "child" && get(targetOption, "isLeaf")) {
        onConfirm && onConfirm(targetOption.value, targetOption, chooseList as IOption[]);
      }
    },
    [showColumns],
  );

  const setValueRef = useRef<boolean>(false);
  const setValueAsyncRef = useRef<boolean>(false);

  //value 复显（理论情况下，只在初始化执行一次）
  useEffect(() => {
    if (!value || (setValueRef.current && setValueAsyncRef.current)) {
      return;
    }
    //columns固定
    if (!setValueRef.current) {
      const targetList: ITreeOption[] = [];
      findTarget(columnsRef.current, value, [], targetList);
      if (size(targetList) > 0) {
        const nextColumns = filter(
          map(targetList, (t) => map(t.children, (c) => omit(c, "children"))),
          (cs) => size(cs) > 0,
        );
        nextColumns.unshift(map(columnsRef.current, (c) => omit(c, "children")));

        const nextChooses = map(targetList, (t) => omit(t, "children"));

        const nextShowColumns = map(nextColumns, (column, i) => {
          const choose = nextChooses[i];
          if (choose) {
            set(
              choose,
              "index",
              findIndex(column, (c) => c.value === choose.value),
            );
          }

          return { column, choose };
        });

        setShowColumns(nextShowColumns as any);
        setCurrentTab(size(nextShowColumns) - 1);

        setValueRef.current = true;

        return;
      }
    }

    if (size(columnsRef.current) > 0) {
      setValueRef.current = true;
    }

    //异步情况
    const currentColumn = get(showColumns, [currentTab, "column"], []);
    const currentChoose = get(showColumns, [currentTab, "choose"], undefined);
    const valueIndex = findIndex(currentColumn, (c) => c.value === value);
    if (!currentChoose && valueIndex > -1) {
      selectItem(currentTab, valueIndex);

      setValueAsyncRef.current = true;
    }
  }, [value, columns, currentTab]);

  const getValue = useCallback(() => {
    const chooseList = filter(
      map(showColumns, (c) => c.choose),
      (c) => !!c,
    );
    const lastChoose = last(chooseList);

    return {
      value: mode === "multiple" ? lastChoose : get(lastChoose, "value"),
      option: lastChoose,
      options: chooseList,
    };
  }, [showColumns, mode]);

  const isCheck = useCallback(
    (value: TValue) => {
      if (mode === "multiple") {
        return some(currentChoose, (v: ChooseType) => v?.value === value);
      } else {
        return (currentChoose as ChooseType)?.value === value;
      }
    },
    [currentChoose, mode],
  );

  return (
    <Stack>
      {showToolbar && mode === "child" && (
        <Stack direction={"row"} style={{ justifyContent: "space-between", alignItems: "center", paddingLeft: "1rem" }}>
          <div style={{ maxWidth: "70%" }}>{title}</div>
          <IconButton
            onClick={() => {
              onCancel && onCancel();
            }}>
            <CloseIcon />
          </IconButton>
        </Stack>
      )}
      {showToolbar && mode === "parent" && (
        <Toolbar
          title={title}
          cancelButtonText={cancelButtonText}
          confirmButtonText={confirmButtonText}
          onCancel={() => {
            onCancel && onCancel();
          }}
          onSure={() => {
            const { value, option, options } = getValue();
            if (value) {
              onConfirm && onConfirm(value, option, options as any);
            } else {
              onCancel && onCancel();
            }
          }}
        />
      )}
      {showToolbar && mode === "multiple" && (
        <Toolbar
          title={title}
          cancelButtonText={cancelButtonText}
          confirmButtonText={confirmButtonText}
          onCancel={() => {
            onCancel && onCancel();
          }}
          onSure={() => {
            const { value, option, options } = getValue();
            if (value) {
              onConfirm && onConfirm(value, option, options as any);
            } else {
              onCancel && onCancel();
            }
          }}
        />
      )}

      <Tabs variant={"scrollable"} scrollButtons={"auto"} value={currentTab} onChange={handleTabChange}>
        {map(showColumns, ({ choose }, index) => {
          const isArr = Array.isArray(choose);
          return (
            <Tab
              key={isArr ? index : choose?.value || index}
              label={isArr ? "多选" : choose ? choose.label : "请选择"}
            />
          );
        })}
      </Tabs>

      <Stack style={{ position: "relative", height: "60vh", overflowY: "auto" }}>
        {loading && (
          <Stack
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "2rem",
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              zIndex: 3,
              backgroundColor: "rgba(255, 255, 255, 0.6)",
            }}>
            <CircularProgress style={{ marginTop: "-80px" }} size={26} />
          </Stack>
        )}
        <List>
          {map(currentColumn, ({ label, value, disable }, index) => {
            return (
              <ListItem
                key={value}
                secondaryAction={isCheck(value) ? <CheckIcon color={"primary"} /> : null}
                disablePadding
                disabled={!!disable}>
                <ListItemButton disabled={!!disable} onClick={() => selectItem(currentTab, index)}>
                  <ListItemText>{label}</ListItemText>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Stack>
    </Stack>
  );
};
