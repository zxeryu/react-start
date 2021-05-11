import React, { createContext, useCallback, useContext, useRef, useState } from "react";
import { Stack } from "@material-ui/core";
import { OperateArea } from "./OperateArea";
import { ShowArea } from "./ShowArea";
import { IElementItem, IOperateElementItem } from "./types";
import { find, forEach, size } from "lodash";
import { addItem, generateId, moveItemById, removeItem } from "./util";

export interface OperatorContextProps {
  //注册的elements
  elements: IElementItem[];
  //操作的elements
  data: IOperateElementItem[];
  //operators
  operator: {
    addElement: (el: IOperateElementItem, locElOID?: string, targetOID?: string) => void;
    addElementById: (elID: string, locElOID?: string, targetOID?: string) => void;
    removeElement: (oid: string) => void;
    arrayMoveById: (oid: string, toOID: string, addToTarget?: boolean) => void;
  };
}

const OperatorContext = createContext<OperatorContextProps>({} as any);

export const useOperator = () => useContext(OperatorContext);

export interface OperateElementItemProp extends Omit<IOperateElementItem, "oid" | "elementList"> {
  oid?: string;
  elementList?: OperateElementItemProp[];
}

export interface OperatorProps {
  elements: IElementItem[];
  initialOElements: OperateElementItemProp[];
}

const setOID = (oels: OperateElementItemProp[]) => {
  forEach(oels, (oel) => {
    if (!oel.oid) {
      oel.oid = generateId();
      if (oel.elementList && size(oel.elementList) > 0) {
        setOID(oel.elementList);
      }
    }
  });
};

export const Operator = ({ elements, initialOElements }: OperatorProps) => {
  const getElement = useCallback((id: string) => {
    return find(elements, (el) => el.id === id);
  }, []);

  //操作elements
  const [data, setData] = useState<IOperateElementItem[]>(() => {
    if (initialOElements) {
      setOID(initialOElements);
      return initialOElements as IOperateElementItem[];
    }
    return [];
  });
  const dataRef = useRef<IOperateElementItem[]>([]);
  dataRef.current = data;

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

  const arrayMoveById = useCallback((oid: string, toOID: string, addToTarget?: boolean) => {
    if (oid === toOID) {
      return;
    }
    setData(moveItemById(dataRef.current, oid, toOID, addToTarget));
  }, []);

  return (
    <OperatorContext.Provider
      value={{
        elements,
        data,
        operator: {
          addElement,
          addElementById,
          removeElement,
          arrayMoveById,
        },
      }}>
      <Stack direction={"row"} style={{ height: "100%" }}>
        <Stack style={{ width: 300 }}>
          <OperateArea />
        </Stack>
        <Stack style={{ flexGrow: 1 }}>
          <ShowArea />
        </Stack>
      </Stack>
    </OperatorContext.Provider>
  );
};
