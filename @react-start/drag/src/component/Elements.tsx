import React, { cloneElement, isValidElement } from "react";
import { useOperator } from "./Compose";
import { Grid, Box } from "@material-ui/core";
import { IElementItem } from "./types";
import { map } from "lodash";
import { useDrag } from "@react-start/hooks";
import { BoxProps } from "@material-ui/core/Box/Box";

export const GridElement: IElementItem = {
  id: "grid-layout",
  showElement: <Grid>布局容器</Grid>,
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
};

const ElementWrapper = ({ children, style, ...otherProps }: BoxProps) => {
  return (
    <Box style={{ width: "50%", cursor: "move", ...style }} {...otherProps}>
      {children}
    </Box>
  );
};

export const ElementList = () => {
  const { elements, operator } = useOperator();

  //拖动方法
  const getDragProps = useDrag<string>({
    onDragStart: (_, id) => {
      operator.setCurrentElementID(id);
    },
    onDragEnd: () => {
      operator.setCurrentElementID();
    },
  });

  return (
    <Grid container>
      <Grid container>
        {isValidElement(GridElement.showElement) && (
          <ElementWrapper {...getDragProps(GridElement.id)} onClick={() => operator.addItem(GridElement.id!)}>
            {cloneElement(GridElement.showElement, { id: GridElement.id })}
          </ElementWrapper>
        )}
      </Grid>
      <Grid container wrap={"wrap"}>
        {map(elements, (el) => {
          if (!isValidElement(el.showElement)) {
            return null;
          }
          return (
            <ElementWrapper key={el.id} {...getDragProps(el.id)} onClick={() => operator.addItem(el.id!)}>
              {cloneElement(el.showElement, { id: el.id })}
            </ElementWrapper>
          );
        })}
      </Grid>
    </Grid>
  );
};
