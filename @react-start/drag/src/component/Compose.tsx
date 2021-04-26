import { IElementItem, IOperateElementItem } from "./types";
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Grid } from "@material-ui/core";
import { ElementList } from "./Elements";
import { OperateArea } from "./OperateArea";
import { map, find, findIndex } from "lodash";
import { generateId } from "../util";

const OperateContext = createContext<{
  //注册的elements
  elements: IElementItem[];
  //操作的elements
  data: IOperateElementItem[];
  //当前拖动的Element id
  currentElementID?: string;
  //operators
  operator: {
    addItem: (elID: string, locElOID?: string) => void;
    setCurrentElementID: (id?: string) => void;
    arrayMoveById: (oid: string, toOID: string) => void;
  };
}>({} as any);

export const useOperator = () => useContext(OperateContext);

export const DragOperator = ({ elements }: { elements: IElementItem[] }) => {
  //给默认id
  const idElements = useMemo(() => {
    return map(elements, (el) => {
      if (el.id) {
        return el;
      }
      el.id = generateId();
      return el;
    });
  }, []);
  const getElement = useCallback((id: string) => {
    return find(idElements, (el) => el.id === id);
  }, []);

  //操作elements
  const [data, setData] = useState<IOperateElementItem[]>([]);
  const dataRef = useRef<IOperateElementItem[]>([]);
  dataRef.current = data;
  //当前拖动的element
  const [currentElementID, setCurrentElementID] = useState<string>();

  const addItem = useCallback((elID: string, locElOID?: string) => {
    const el = getElement(elID);
    if (!el) {
      return;
    }
    const newItem: IOperateElementItem = { ...el, oid: generateId() };
    if (locElOID) {
      const index = findIndex(dataRef.current, (el) => el.oid === locElOID);
      if (index > -1) {
        dataRef.current.splice(index, 0, newItem);
        setData(dataRef.current);
        return;
      }
    }
    setData((prevState) => [...prevState, newItem]);
  }, []);

  const arrayMove = useCallback((index: number, toIndex: number) => {
    const [target] = dataRef.current.splice(index, 1);
    dataRef.current.splice(toIndex, 0, target);
    setData(dataRef.current);
  }, []);

  const arrayMoveById = useCallback((oid: string, toOID: string) => {
    const index = findIndex(dataRef.current, (item) => item.oid === oid);
    const toIndex = findIndex(dataRef.current, (item) => item.oid === toOID);
    if (index > -1 && toIndex > -1) {
      arrayMove(index, toIndex);
    }
  }, []);

  return (
    <OperateContext.Provider
      value={{
        elements: idElements,
        currentElementID,
        data,
        operator: { addItem, setCurrentElementID, arrayMoveById },
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
