import React, { ReactNode, isValidElement, useState, useCallback, useMemo, useRef, useEffect } from "react";

import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Stack from "@material-ui/core/Stack";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemButton from "@material-ui/core/ListItemButton";
import ListItemText from "@material-ui/core/ListItemText";
import CircularProgress from "@material-ui/core/CircularProgress";

import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";

import { IOption, ITreeOption } from "../type";
import { map, omit, get, slice, set, size, join, last } from "lodash";

export interface CascaderProps {
  title?: ReactNode;
  loading?: boolean;
  columns: ITreeOption[];
  value?: IOption["value"];
  onChange?: (v: IOption["value"]) => void;
}

interface ShowColumnOption {
  choose?: IOption & { index: number };
  column: IOption[];
}

export const Cascader = ({ title, loading, columns, onChange, value }: CascaderProps) => {
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
      map(showColumnsRef.current, ({ choose }) => choose!.index),
      ".children.",
    );
    const lastOption = get(columns, path);
    if (lastOption && size(lastOption.children) > 0) {
      setShowColumns((prev) => [...prev, { column: lastOption.children }]);
      setCurrentTab(size(showColumnsRef.current));
    }
  }, [columns]);

  useEffect(() => {
    if (value && columns && size(showColumns) === 1 && !showColumns[0].choose) {
      //todo:: control
    }
  }, [value, showColumns]);

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
      set(nextShowColumns[tabIndex], "choose", { ...targetOption, index: itemIndex });
      const path = join(
        map(nextShowColumns, ({ choose }) => choose!.index),
        ".children.",
      );
      const targetTreeOption = get(columnsRef.current, path);
      if (targetTreeOption && size(targetTreeOption.children) > 0) {
        nextShowColumns.push({ column: targetTreeOption.children });
      }
      setShowColumns(nextShowColumns);
      setCurrentTab(size(nextShowColumns) - 1);

      onChange && onChange(targetOption.value);
    },
    [showColumns],
  );

  return (
    <Stack>
      <Stack direction={"row"} css={{ justifyContent: "space-between", alignItems: "center" }}>
        {isValidElement(title) ? (
          title
        ) : (
          <Typography css={{ paddingLeft: "1rem" }} variant={"h6"}>
            {title}
          </Typography>
        )}
        <IconButton>
          <CloseIcon />
        </IconButton>
      </Stack>
      <Tabs variant={"scrollable"} scrollButtons={"auto"} value={currentTab} onChange={handleTabChange}>
        {map(showColumns, ({ choose }) => {
          return <Tab key={choose?.value} label={choose ? choose.label : "请选择"} />;
        })}
      </Tabs>

      <Stack css={{ position: "relative", height: "60vh", overflowY: "auto" }}>
        {loading && (
          <Stack
            css={{
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
            <CircularProgress css={{ marginTop: "-80px" }} size={26} />
          </Stack>
        )}
        <List>
          {map(currentColumn, ({ label, value, disable }, index) => {
            return (
              <ListItem
                key={value}
                secondaryAction={currentChoose?.value === value ? <CheckIcon color={"primary"} /> : null}
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
