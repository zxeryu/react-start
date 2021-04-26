import React, { cloneElement, isValidElement, useCallback, useEffect, useMemo, useState } from "react";
import { useOperator } from "./Compose";
import { Box } from "@material-ui/core";
import { useDrag, useDrop } from "@react-start/hooks";
import { map, get, debounce, last } from "lodash";

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

  const [dropProps] = useDrop<string>({
    onDom: (id) => {
      if (currentOElementID) {
        operator.arrayMoveById(currentOElementID, locOID ? locOID : last(data)!.oid);
      } else {
        operator.addItem(id, locOID);
      }
    },
    onDragOver: (e) => {
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

  const showTopBorder = useCallback(
    (oid: string) => {
      if (locOID) {
        return locOID === oid;
      }
      return false;
    },
    [currentOElementID, locOID],
  );

  const showBottomBorder = useMemo(() => {
    if ((currentElementID || currentOElementID) && !locOID) {
      return true;
    }
    return false;
  }, [currentElementID, locOID, currentOElementID]);

  return (
    <Box {...dropProps} style={{ width: "100%", paddingBottom: 100, backgroundColor: "pink" }}>
      {map(data, (el) => {
        if (!isValidElement(el.showElement)) {
          return null;
        }
        return (
          <React.Fragment key={el.oid}>
            {/*{showTopBorder(el.oid) && <Box style={{ height: 2, backgroundColor: "blue" }} />}*/}
            {cloneElement(el.showElement, {
              "data-oid": el.oid,
              ...getDragProps(el.oid),
              style: {
                cursor: "move",
                borderTop: showTopBorder(el.oid) ? "2px solid blue" : "none",
              },
            })}
          </React.Fragment>
        );
        // return (
        //   <Box key={el.oid} data-oid={el.oid} style={{ borderTop: locOID === el.oid ? "2px solid blue" : "none" }}>
        //     {}
        //   </Box>
        // );
      })}
      {showBottomBorder && <Box style={{ height: 2, backgroundColor: "blue" }} />}
    </Box>
  );
};
