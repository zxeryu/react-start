import { IElementItem, IOperateElementItem } from "../types";
import { Grid, GridTypeMap } from "@material-ui/core";
import React, { ElementType } from "react";
import { OverrideProps } from "@material-ui/core/OverridableComponent";
import { get, map } from "lodash";
import { OperateItem } from "./OperateArea";
import { useOperator } from "./Compose";

export const GridLayout = ({
  style,
  elements,
  getDragProps,
  ...otherProps
}: OverrideProps<GridTypeMap, ElementType> & {
  elements?: IOperateElementItem[];
  getDragProps?: any;
}) => {
  const { currentOElementID } = useOperator();
  const currentOID = get(otherProps, ["data-oid"]);

  return (
    <Grid {...otherProps} style={{ ...style, margin: 30 }}>
      {`布局容器${currentOID}`}

      {currentOElementID === currentOID ? (
        <div>拖动...</div>
      ) : (
        map(elements as IOperateElementItem[], (el) => {
          return <OperateItem key={el.oid} el={el} />;
        })
      )}
    </Grid>
  );
};

export const GridLayoutID = "grid-layout";

export const GridElement: IElementItem = {
  id: GridLayoutID,
  showElement: <GridLayout />,
  menuElement: <GridLayout />,
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
