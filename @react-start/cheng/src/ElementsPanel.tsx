import React, { cloneElement, CSSProperties, isValidElement } from "react";
import { IconButton, Stack } from "@material-ui/core";
import { useOperator } from "./Operator";
import { map } from "lodash";
import { Close as CloseIcon } from "@material-ui/icons";

export const ElementsPanel = ({ style, onClose }: { style?: CSSProperties; onClose: () => void }) => {
  const { elements, operator, changeRef } = useOperator();

  return (
    <Stack
      direction={"column"}
      spacing={"10px"}
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: "white",
        ...style,
      }}>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <div>添加元素</div>
        <IconButton onClick={() => onClose()}>
          <CloseIcon />
        </IconButton>
      </Stack>

      {map(elements, (el) => {
        if (!isValidElement(el.menuElement)) {
          return null;
        }
        return cloneElement(el.menuElement, {
          key: el.id,
          onClick: () => {
            changeRef.current = true;
            el.id && operator.addElementById(el.id);
            onClose();
          },
        });
      })}
    </Stack>
  );
};
