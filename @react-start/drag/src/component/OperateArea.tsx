import React, { cloneElement, isValidElement, useCallback, useEffect, useState } from "react";
import { useOperator } from "./Compose";
import { Box } from "@material-ui/core";
import { useDrag, useDrop } from "@react-start/hooks";
import { map, get, debounce } from "lodash";

export const OperateArea = () => {
  const { currentElementID, data, operator } = useOperator();

  //左侧拖动添加
  const [locOID, setLocOID] = useState<string>();
  const debounceSetLocOID = useCallback(
    debounce((oid: string) => {
      setLocOID(oid);
    }, 10),
    [],
  );
  useEffect(() => {
    !currentElementID && setLocOID(undefined);
  }, [currentElementID]);

  //内部拖动调整位置 id
  const [currentOElementID, setCurrentOElementID] = useState<string>();
  useEffect(() => {
    if (currentElementID) {
      return;
    }
    if (currentOElementID && locOID) {
      operator.arrayMoveById(currentOElementID, locOID);
    }
  }, [currentOElementID, locOID, currentElementID]);

  const [dropProps] = useDrop<string>({
    onDom: (id) => {
      operator.addItem(id, locOID);
    },
    onDragOver: (e) => {
      const oid = get(e.target, ["dataset", "oid"]);
      if (oid) {
        debounceSetLocOID(oid);
      }
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

  const showBorder = useCallback(
    (oid: string) => {
      if (currentOElementID) {
        return currentOElementID === oid;
      }
      if (locOID) {
        return locOID === oid;
      }
      return false;
    },
    [currentOElementID, locOID],
  );

  return (
    <Box {...dropProps} style={{ width: "100%", paddingBottom: 100, backgroundColor: "pink" }}>
      {map(data, (el) => {
        if (!isValidElement(el.showElement)) {
          return null;
        }
        return cloneElement(el.showElement, {
          key: el.oid,
          "data-oid": el.oid,
          ...getDragProps(el.oid),
          style: { cursor: "move", borderTop: showBorder(el.oid) ? "2px solid blue" : "none" },
        });
        // return (
        //   <Box key={el.oid} data-oid={el.oid} style={{ borderTop: locOID === el.oid ? "2px solid blue" : "none" }}>
        //     {}
        //   </Box>
        // );
      })}
    </Box>
  );
};
