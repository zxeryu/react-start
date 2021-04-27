import { IElementItem } from "../types";
import { Grid, GridTypeMap } from "@material-ui/core";
import React, { ElementType } from "react";
import { OverrideProps } from "@material-ui/core/OverridableComponent";
import { useDrop } from "@react-start/hooks";
import { useOperator } from "./Compose";
import { get } from "lodash";

const GridLayout = ({ style, children, ...otherProps }: OverrideProps<GridTypeMap, ElementType>) => {
  const { operator } = useOperator();
  const oid = get(otherProps, ["data-oid"]);

  const [dropProps, { isHovering }] = useDrop<string>({
    onDom: (id, e) => {
      e?.preventDefault();
      e?.stopPropagation();

      if (oid && id) {
        operator.addLayoutElement(id, oid);
      }
    },
    onDragOver: (e) => {
      e?.preventDefault();
      e?.stopPropagation();
    },
  });

  // console.log("@@@@@@@@@@", isHovering, otherProps);

  return (
    <Grid {...dropProps} {...otherProps} style={{ ...style, padding: isHovering ? 20 : 0 }}>
      {!children && "布局容器"}
      {children}
    </Grid>
  );
};

export const GridElement: IElementItem = {
  id: "grid-layout",
  showElement: <GridLayout />,
  setProps: {
    alignContent: {
      chooseValue: ["stretch", "center", "flex-start", "flex-end", "space-between", "space-around"],
    },
    alignItems: {
      chooseValue: ["flex-start", "center", "flex-end", "stretch", "baseline"],
    },
    container: { type: "boolean" },
    direction: {
      chooseValue: ["row", "row-reverse", "column", "column-reverse"],
    },
    item: { type: "boolean" },
    justify: {
      chooseValue: ["flex-start", "center", "flex-end", "space-between", "space-around", "space-evenly"],
    },
    spacing: {
      chooseValue: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    wrap: {
      chooseValue: ["nowrap", "wrap", "wrap-reverse"],
    },
    zeroMinWidth: { type: "boolean" },
    xs: {
      chooseValue: ["auto", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    },
  },
  name: "布局容器",
};
