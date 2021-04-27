import { IElementItem, IOperateElementItem } from "../types";
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Grid } from "@material-ui/core";
import { ElementList } from "./Elements";
import { OperateArea } from "./OperateArea";
import { map, find } from "lodash";
import { addItem, generateId, moveItemById, removeItem } from "../util";
import { GridElement } from "./Layout";

const OperateContext = createContext<{
  //注册的elements
  elements: IElementItem[];
  //操作的elements
  data: IOperateElementItem[];
  //当前拖动的Element
  dragElement?: IElementItem;
  //operators
  operator: {
    addElement: (el: IOperateElementItem, locElOID?: string) => void;
    addElementById: (elID: string, locElOID?: string) => void;
    removeElement: (oid: string) => void;
    addLayoutElement: (id: string, oid: string) => void;
    setDragElementID: (id?: string) => void;
    arrayMoveById: (oid: string, toOID: string) => void;
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

  const addElement = useCallback((el: IOperateElementItem, locOID?: string) => {
    const arr = addItem(dataRef.current, el, locOID);
    setData(arr);
  }, []);

  const addElementById = useCallback((elID: string, locElOID?: string) => {
    const el = getElement(elID);
    if (!el) {
      return;
    }
    addElement({ ...el, oid: generateId() }, locElOID);
  }, []);

  const removeElement = useCallback((oid: string) => {
    const arr = removeItem(dataRef.current, oid);
    setData(arr);
  }, []);

  const arrayMoveById = useCallback((oid: string, toOID: string) => {
    const arr = moveItemById(dataRef.current, oid, toOID);
    setData(arr);
  }, []);

  const addLayoutElement = useCallback((id: string, oid: string) => {
    const el = getElement(id);
    if (el) {
      setData((prevState) => {
        return map(prevState, (item) => {
          if (item.oid === oid) {
            const newItem: IOperateElementItem = { ...el, oid: generateId() };
            if (item.children) {
              item.children.push(newItem);
            } else {
              item.children = [newItem];
            }
          }
          return item;
        });
      });
    }
  }, []);

  return (
    <OperateContext.Provider
      value={{
        elements: idElements,
        dragElement,
        data,
        operator: {
          addElement,
          addElementById,
          removeElement,
          setDragElementID,
          arrayMoveById,
          addLayoutElement,
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
