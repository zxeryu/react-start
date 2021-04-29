import { IElementItem, IOperateElementItem } from "../types";
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Grid } from "@material-ui/core";
import { ElementList } from "./Elements";
import { OperateArea } from "./OperateArea";
import { map, find } from "lodash";
import { addItem, generateId, moveItemById, removeItem } from "../util";
import { GridElement } from "./Layout";
import { PropFun, useDrag } from "@react-start/hooks";

const OperateContext = createContext<{
  //注册的elements
  elements: IElementItem[];
  //操作的elements
  data: IOperateElementItem[];
  //当前拖动的Element from：left
  dragElement?: IElementItem;
  //当前内部拖动元素 oid
  currentOElementID?: string;
  //可拖动的方法
  getDragProps: PropFun<string>;
  //operators
  operator: {
    addElement: (el: IOperateElementItem, locElOID?: string, targetOID?: string) => void;
    addElementById: (elID: string, locElOID?: string, targetOID?: string) => void;
    removeElement: (oid: string) => void;
    arrayMoveById: (oid: string, toOID: string) => void;
    setDragElementID: (id?: string) => void;
  };
}>({} as any);

export const useOperator = () => useContext(OperateContext);

export const DragOperator = ({ elements }: { elements: IElementItem[] }) => {
  //给默认id
  const idElements = useMemo(() => {
    const els = map(elements, (el) => {
      if (el.id) {
        return el;
      }
      el.id = generateId();
      return el;
    });
    els.push(GridElement);
    return els;
  }, []);
  const getElement = useCallback((id: string) => {
    return find(idElements, (el) => el.id === id);
  }, []);

  //操作elements
  const [data, setData] = useState<IOperateElementItem[]>([]);
  const dataRef = useRef<IOperateElementItem[]>([]);
  dataRef.current = data;
  //当前拖动的element
  const [dragElement, setDragElement] = useState<IElementItem>();
  const setDragElementID = useCallback((id?: string) => {
    if (!id) {
      setDragElement(undefined);
      return;
    }
    const el = getElement(id);
    setDragElement(el);
  }, []);

  //内部拖动调整位置 id
  const [currentOElementID, setCurrentOElementID] = useState<string>();

  //拖动事件注册方法
  const getDragProps = useDrag<string>({
    onDragStart: (e, oid) => {
      e.stopPropagation();
      oid && setCurrentOElementID(oid);
    },
    onDragEnd: (e) => {
      e.stopPropagation();
      setCurrentOElementID(undefined);
    },
  });

  //operator methods

  const addElement = useCallback((el: IOperateElementItem, locOID?: string, targetOID?: string) => {
    setData(addItem(dataRef.current, el, locOID, targetOID));
  }, []);

  const addElementById = useCallback((elID: string, locElOID?: string, targetOID?: string) => {
    const el = getElement(elID);
    if (!el) {
      return;
    }
    addElement({ ...el, oid: generateId() }, locElOID, targetOID);
  }, []);

  const removeElement = useCallback((oid: string) => {
    setData(removeItem(dataRef.current, oid));
  }, []);

  const arrayMoveById = useCallback((oid: string, toOID: string) => {
    if (oid === toOID) {
      return;
    }
    setData(moveItemById(dataRef.current, oid, toOID));
  }, []);

  return (
    <OperateContext.Provider
      value={{
        elements: idElements,
        dragElement,
        data,
        currentOElementID,
        getDragProps,
        operator: {
          addElement,
          addElementById,
          removeElement,
          setDragElementID,
          arrayMoveById,
        },
      }}>
      <Grid container direction={"row"}>
        <Grid item style={{ width: 260 }}>
          <ElementList />
        </Grid>
        <Grid item style={{ flexGrow: 1 }}>
          <OperateArea />
        </Grid>
      </Grid>
    </OperateContext.Provider>
  );
};
