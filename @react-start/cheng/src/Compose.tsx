import React, {
  createContext,
  CSSProperties,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
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
    setData: Dispatch<SetStateAction<IOperateElementItem[]>>;
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
  showAreaProps?: CSSProperties;
  operatePanelProps?: CSSProperties;
  operateAreaProps?: CSSProperties;
  style?: CSSProperties;
  operateExtra?: IOperateElementItem[];
  children?: ReactNode;
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

export const Operator = ({
  elements,
  initialOElements,
  showAreaProps,
  operateAreaProps,
  operatePanelProps,
  style,
  operateExtra,
  children,
}: OperatorProps) => {
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
          setData,
        },
      }}>
      <Stack direction={"row"} style={{ height: "100%", ...style }}>
        <Stack style={{ width: 300, minWidth: 300, height: "100%" }}>
          <OperateArea
            operateAreaProps={operateAreaProps}
            operatePanelProps={operatePanelProps}
            operateExtra={operateExtra}
          />
        </Stack>
        <Stack style={{ flexGrow: 1, alignItems: "center" }}>{children || <ShowArea {...showAreaProps} />}</Stack>
      </Stack>
    </OperatorContext.Provider>
  );
};
