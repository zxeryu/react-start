import React from "react";
import { Stack, StackProps } from "@material-ui/core";
import { IElementItem, IOperateElementItem } from "./types";
import { map } from "lodash";
import { ShowItem } from "./ShowArea";
import { OperateItem } from "./OperateArea";

export const StackLayout = ({
  data,
  spacing,
  isMenu,
  ...otherProps
}: StackProps & {
  data?: IOperateElementItem;
  isMenu?: boolean;
}) => {
  return (
    <Stack spacing={spacing} style={{ ...otherProps } as any}>
      {map(data?.elementList, (oel) =>
        isMenu ? <OperateItem key={oel.oid} oel={oel} /> : <ShowItem key={oel.oid} oel={oel} />,
      )}
    </Stack>
  );
};

export const StackElementID = "stack-layout";

export const StackElement: IElementItem = {
  id: StackElementID,
  menuElement: <StackLayout isMenu />,
  showElement: <StackLayout />,
  setProps: {
    spacing: {
      name: "间隔",
      inputType: "input",
    },
    more: {
      name: "更多",
      inputType: "json",
    },
    //style 常用属性
    flexDirection: {
      name: "方向",
      chooseValue: ["row", "row-reverse", "column", "column-reverse"],
    },
    justifyContent: {
      name: "主轴",
      chooseValue: ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"],
    },
    alignItems: {
      name: "交叉轴",
      chooseValue: ["flex-start", "center", "flex-end", "stretch", "baseline"],
    },
    flexWrap: {
      name: "换行",
      chooseValue: ["nowrap", "wrap", "wrap-reverse"],
    },
  },
};

const PlaceholderOID = "placeholder";

const Placeholder = ({ style, ...props }: StackProps) => (
  <Stack {...props} style={{ borderTop: "2px solid blue", ...style }} />
);

export const PlaceholderElement: IOperateElementItem = {
  menuElement: <Placeholder />,
  showElement: <Placeholder />,
  id: PlaceholderOID,
  oid: PlaceholderOID,
};
