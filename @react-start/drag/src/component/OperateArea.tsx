import React, { cloneElement, isValidElement, useCallback, useEffect, useRef, useState } from "react";
import { useOperator } from "./Compose";
import { Box, BoxProps } from "@material-ui/core";
import { useDrop } from "@react-start/hooks";
import { map, get, debounce } from "lodash";
import { IOperateElementItem } from "../types";
import { GridLayoutID } from "./Layout";

const PlaceholderOID = "placeholder";

const Placeholder = ({ style, ...props }: BoxProps) => (
  <Box {...props} style={{ borderTop: "2px solid blue", ...style }} />
);

const PlaceholderElement: IOperateElementItem = {
  showElement: <Placeholder />,
  id: PlaceholderOID,
  oid: PlaceholderOID,
};

export const OperateItem = ({ el }: { el: IOperateElementItem }) => {
  const { dragElement, getDragProps, currentOElementID } = useOperator();

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
  return cloneElement(el.showElement, {
    "data-oid": el.oid,
    "data-id": el.id,
    elements: el.elementList,
    ...getDragProps(el.oid),
    style: {
      cursor: "move",
      borderTop: currentOElementID === el.oid ? "2px solid blue" : "none",
    },
  });
};

export const OperateArea = () => {
  const { dragElement, currentOElementID, data, operator } = useOperator();

  const [locOID, setLocOID] = useState<string>();
  const locIDRef = useRef<string>();
  const debounceSetLocOID = useCallback(
    debounce((oid: string) => {
      setLocOID(oid);
    }, 20),
    [],
  );

  const [dropProps, { isHovering }] = useDrop<string>({
    onDom: (id) => {
      if (dragElement) {
        if (locIDRef.current === GridLayoutID) {
          operator.addElementById(id, undefined, locOID);
        } else {
          operator.addElementById(id, locOID);
        }
      }
    },
    onDragOver: (e) => {
      const id = get(e.target, ["dataset", "id"]);
      const oid = get(e.target, ["dataset", "oid"]);

      if (oid === PlaceholderOID) {
        return;
      }
      oid && debounceSetLocOID(oid);
      id && (locIDRef.current = id);
    },
  });

  //左侧拖动添加
  useEffect(() => {
    if (dragElement && isHovering) {
      operator.addElement(PlaceholderElement);
    } else {
      operator.removeElement(PlaceholderOID);
      setLocOID(undefined);
    }
  }, [dragElement, isHovering]);

  //移动元素
  useEffect(() => {
    if (!isHovering) {
      return;
    }
    if (dragElement && locOID) {
      operator.arrayMoveById(PlaceholderOID, locOID);
      return;
    }
    if (currentOElementID && locOID) {
      // operator.arrayMoveById(currentOElementID, locOID ? locOID : last(data)!.oid);
      operator.arrayMoveById(currentOElementID, locOID);
    }
  }, [dragElement, currentOElementID, locOID, isHovering]);

  // return (
  //   <GridLayout {...dropProps} elements={data} style={{ width: "100%", paddingBottom: 100, backgroundColor: "pink" }} />
  // );

  // console.log("data=", data);

  return (
    <Box {...dropProps} style={{ width: "100%", paddingBottom: 100, backgroundColor: "pink" }}>
      {map(data, (el) => {
        return <OperateItem key={el.oid} el={el} />;
      })}
    </Box>
  );
};

// export const OperateArea = () => {
//   const { data } = useOperator();
//
//   return <GridLayout elements={data} style={{ width: "100%", paddingBottom: 100, backgroundColor: "pink" }} />;
// };
