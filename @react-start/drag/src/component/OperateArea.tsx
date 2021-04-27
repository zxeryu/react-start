import React, { cloneElement, isValidElement, useCallback, useEffect, useState } from "react";
import { useOperator } from "./Compose";
import { Box, BoxProps } from "@material-ui/core";
import { useDrag, useDrop } from "@react-start/hooks";
import { map, get, debounce } from "lodash";
import { IOperateElementItem } from "../types";

const PlaceholderOID = "placeholder";

const Placeholder = ({ style, ...props }: BoxProps) => (
  <Box {...props} style={{ borderTop: "2px solid blue", ...style }} />
);

const PlaceholderElement: IOperateElementItem = {
  showElement: <Placeholder />,
  id: PlaceholderOID,
  oid: PlaceholderOID,
};

export const OperateArea = () => {
  const { dragElement, data, operator } = useOperator();

  //左侧拖动添加
  const [locOID, setLocOID] = useState<string>();
  const debounceSetLocOID = useCallback(
    debounce((oid: string) => {
      setLocOID(oid);
    }, 10),
    [],
  );
  useEffect(() => {
    if (dragElement) {
      operator.addElement(PlaceholderElement);
    } else {
      operator.removeElement(PlaceholderOID);
      setLocOID(undefined);
    }
  }, [dragElement]);

  //内部拖动调整位置 id
  const [currentOElementID, setCurrentOElementID] = useState<string>();

  useEffect(() => {
    if (dragElement && locOID) {
      operator.arrayMoveById(PlaceholderOID, locOID);
      return;
    }
    if (currentOElementID && locOID) {
      // operator.arrayMoveById(currentOElementID, locOID ? locOID : last(data)!.oid);
      operator.arrayMoveById(currentOElementID, locOID);
    }
  }, [dragElement, currentOElementID, locOID]);

  const [dropProps] = useDrop<string>({
    onDom: (id, e) => {
      e?.stopPropagation();
      if (dragElement) {
        operator.addElementById(id, locOID);
      }
    },
    onDragOver: (e) => {
      e.stopPropagation();
      const oid = get(e.target, ["dataset", "oid"]);
      debounceSetLocOID(oid);
    },
  });

  const getDragProps = useDrag<string>({
    onDragStart: (_, oid) => {
      oid && setCurrentOElementID(oid);
    },
    onDragEnd: () => {
      setCurrentOElementID(undefined);
      setLocOID(undefined);
    },
  });

  return (
    <Box {...dropProps} style={{ width: "100%", paddingBottom: 100, backgroundColor: "pink" }}>
      {map(data, (el) => {
        if (!isValidElement(el.showElement)) {
          return null;
        }
        if (el.oid === PlaceholderOID) {
          return cloneElement(el.showElement, {
            key: el.oid,
            "data-oid": el.oid,
            children: dragElement?.name,
          });
        }
        return (
          <React.Fragment key={el.oid}>
            {cloneElement(el.showElement, {
              "data-oid": el.oid,
              ...getDragProps(el.oid),
              style: {
                cursor: "move",
                borderTop: currentOElementID === el.oid ? "2px solid blue" : "none",
              },
            })}
          </React.Fragment>
        );
      })}
    </Box>
  );
};
