import React, { cloneElement, CSSProperties, isValidElement } from "react";
import { IconButton, Stack } from "@material-ui/core";
import { map } from "lodash";
import { Close as CloseIcon } from "@material-ui/icons";
import { useOperator } from "./Operator";
import { IElementItem } from "./types";
import { Dialog, Item } from "./component";

export const ElementsPanel = ({
  style,
  onClose,
  onSuccess,
}: {
  style?: CSSProperties;
  onClose: () => void;
  onSuccess: (el: IElementItem) => void;
}) => {
  const { elements } = useOperator();

  return (
    <Stack
      className={"ElementsPanel"}
      direction={"column"}
      spacing={"10px"}
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: "white",
        overflowY: "auto",
        ...style,
      }}>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <div style={{ paddingLeft: 10 }}>添加元素</div>
        <IconButton onClick={() => onClose()}>
          <CloseIcon />
        </IconButton>
      </Stack>

      {map(elements, (el) => {
        if (!isValidElement(el.menuElement)) {
          return <Item key={el.id} label={el.name} onClick={() => onSuccess(el)} />;
        }
        return cloneElement(el.menuElement, {
          key: el.id,
          onClick: () => onSuccess(el),
        });
      })}
    </Stack>
  );
};

export const ElementsDialog = ({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (el: IElementItem) => void;
}) => {
  const { elements } = useOperator();

  return (
    <Dialog open noFooter maxWidth={"lg"} title={"选择元素"} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        {map(elements, (el) => {
          return (
            <Item
              key={el.id}
              style={{
                border: "1px solid #eee",
                borderRadius: 4,
                margin: "4px 8px",
                padding: "6px 10px",
              }}
              label={el.name}
              onClick={() => onSuccess(el)}
            />
          );
        })}
      </div>
    </Dialog>
  );
};
