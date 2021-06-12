import React, {
  createContext,
  CSSProperties,
  Dispatch,
  MutableRefObject,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
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
  //
  hoveringRef: MutableRefObject<boolean>;
  changeRef: MutableRefObject<boolean>;
}

const OperatorContext = createContext<OperatorContextProps>({} as any);

export const useOperator = () => useContext(OperatorContext);

export interface OperateElementItemProp extends Omit<IOperateElementItem, "oid" | "elementList"> {
  oid?: string;
  elementList?: OperateElementItemProp[];
}

export interface OperatorProps {
  elements: IElementItem[];
  operateElements: OperateElementItemProp[];
  showAreaProps?: CSSProperties;
  operatePanelProps?: CSSProperties;
  operateAreaProps?: CSSProperties;
  style?: CSSProperties;
  extraOperateElements?: IOperateElementItem[];
  onExtraChange?: (id: string, key: string, value: any) => void;
  children?: ReactNode;
  onChange?: (data: IOperateElementItem[]) => void;
}

const setOID = (oels: OperateElementItemProp[]) => {
  forEach(oels, (oel) => {
    if (!oel.oid) {
      oel.oid = generateId();
    }
    if (oel.elementList && size(oel.elementList) > 0) {
      setOID(oel.elementList);
    }
  });
};

export const Operator = ({
  elements,
  operateElements,
  showAreaProps,
  operateAreaProps,
  operatePanelProps,
  style,
  extraOperateElements,
  onExtraChange,
  onChange,
  children,
}: OperatorProps) => {
  const getElement = useCallback(
    (id: string) => {
      return find(elements, (el) => el.id === id);
    },
    [elements],
  );

  //操作elements
  const [data, setData] = useState<IOperateElementItem[]>([]);
  useEffect(() => {
    if (!operateElements) {
      return;
    }
    setOID(operateElements);
    setData(operateElements as IOperateElementItem[]);
  }, [operateElements]);
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

  const hoveringRef = useRef<boolean>(false);
  const changeRef = useRef<boolean>(false);

  //onChange事件
  useEffect(() => {
    if (!onChange) {
      return;
    }
    if (hoveringRef.current) {
      return;
    }
    if (changeRef.current) {
      onChange(data);
      changeRef.current = false;
    }
  }, [data]);

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
        hoveringRef,
        changeRef,
      }}>
      <Stack direction={"row"} style={{ height: "100%", ...style }}>
        <Stack style={{ width: 300, minWidth: 300, height: "100%" }}>
          <OperateArea
            operateAreaProps={operateAreaProps}
            operatePanelProps={operatePanelProps}
            operateExtra={extraOperateElements}
            onExtraChange={onExtraChange}
          />
        </Stack>
        <Stack style={{ flexGrow: 1, alignItems: "center" }}>{children || <ShowArea {...showAreaProps} />}</Stack>
      </Stack>
    </OperatorContext.Provider>
  );
};
