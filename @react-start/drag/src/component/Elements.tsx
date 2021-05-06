import React, { cloneElement, isValidElement } from "react";
import { useOperator } from "./Compose";
import { Grid, Box } from "@material-ui/core";
import { map } from "lodash";
import { useDrag } from "@react-start/hooks";
import { BoxProps } from "@material-ui/core/Box/Box";

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
      operator.setDragElementID(id);
    },
    onDragEnd: () => {
      operator.setDragElementID();
    },
  });

  return (
    <Grid container>
      <Grid container wrap={"wrap"}>
        {map(elements, (el) => {
          if (!isValidElement(el.menuElement)) {
            return null;
          }
          return (
            <ElementWrapper key={el.id} {...getDragProps(el.id)} onClick={() => operator.addElementById(el.id!)}>
              {cloneElement(el.menuElement, { id: el.id })}
            </ElementWrapper>
          );
        })}
      </Grid>
    </Grid>
  );
};
