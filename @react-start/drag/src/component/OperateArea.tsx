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

export const OperateItem = ({
  el,
  getDragProps,
  current,
}: {
  el: IOperateElementItem;
  getDragProps: any;
  current: boolean;
}) => {
  const { dragElement } = useOperator();

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
    elements: el.elementList,
    ...getDragProps(el.oid),
    style: {
      cursor: "move",
      borderTop: current ? "2px solid blue" : "none",
    },
  });
};

export const OperateArea = () => {
  const { dragElement, data, operator } = useOperator();

  const [locOID, setLocOID] = useState<string>();
  const debounceSetLocOID = useCallback(
    debounce((oid: string) => {
      setLocOID(oid);
    }, 10),
    [],
  );

  const [dropProps, { isHovering }] = useDrop<string>({
    onDom: (id) => {
      if (dragElement) {
        operator.addElementById(id, locOID);
      }
    },
    onDragOver: (e) => {
      const oid = get(e.target, ["dataset", "oid"]);
      debounceSetLocOID(oid);
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

  //内部拖动调整位置 id
  const [currentOElementID, setCurrentOElementID] = useState<string>();

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
        return <OperateItem key={el.oid} el={el} getDragProps={getDragProps} current={currentOElementID === el.oid} />;
      })}
    </Box>
  );
};
