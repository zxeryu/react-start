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
import { OperateArea, OperateItem } from "./OperateArea";
import { IElementItem, IOperateElementItem } from "./types";
import { find, forEach, size, map, filter, isEmpty, get } from "lodash";
import { addItem, generateId, moveItemById, removeItem } from "./util";
import { OperatePanel, OperatePanelProps } from "./OperatePanel";
import { ElementsPanel } from "./ElementsPanel";

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
  //
  addPanel: (oel: IOperateElementItem) => void;
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
  operatePanelProps?: CSSProperties;
  operateAreaProps?: CSSProperties;
  style?: CSSProperties;
  extraOperateElements?: IOperateElementItem[];
  onExtraChange?: (id: string, key: string, value: any) => void;
  onChange?: (data: IOperateElementItem[]) => void;
  header?: ReactNode;
  footer?: ReactNode;
  extraSetElementMap?: OperatePanelProps["extraSetElementMap"];
  addElementMenu?: string | ReactNode;
  elementsPanelProps?: CSSProperties;
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
  operateAreaProps,
  operatePanelProps,
  style,
  extraOperateElements,
  onExtraChange,
  onChange,
  header,
  footer,
  extraSetElementMap,
  addElementMenu,
  elementsPanelProps,
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

  //************************************ onChange事件 ******************************************
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

  //************************************ panel操作 ******************************************

  const [openPanels, setOpenPanels] = useState<IOperateElementItem[]>([]);

  const addPanel = useCallback((oel: IOperateElementItem) => {
    if (!oel.setElement && isEmpty(oel.setProps) && !get(oel, "isExtra")) {
      return;
    }
    setOpenPanels((prev) => [...prev, oel]);
  }, []);

  //************************************elements panel ******************************************

  const [elementPanelShow, setElementPanelShow] = useState<boolean>(false);

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
        addPanel,
      }}>
      <Stack style={{ position: "relative", width: 300, minWidth: 300, height: "100%", ...style }} direction={"column"}>
        {header}
        <OperateArea operateAreaProps={operateAreaProps} />

        <Stack>
          {map(extraOperateElements, (oel) => (
            <OperateItem
              key={oel.oid}
              oel={oel}
              onClick={() => {
                addPanel(oel);
              }}
            />
          ))}
        </Stack>

        {size(elements) > 0 && (
          <Stack
            onClick={() => {
              setElementPanelShow(true);
            }}>
            {addElementMenu || "添加元素"}
          </Stack>
        )}

        {footer}

        {map(openPanels, (oel) => (
          <OperatePanel
            key={oel.oid}
            style={operatePanelProps}
            oel={oel}
            extraSetElementMap={extraSetElementMap}
            onClose={(oid) => {
              setOpenPanels((prev) => {
                return filter(prev, (o) => o.oid !== oid);
              });
            }}
            onOpen={(oel) => {
              setOpenPanels((prev) => [...prev, oel]);
            }}
            onExtraChange={onExtraChange}
          />
        ))}

        {elementPanelShow && <ElementsPanel onClose={() => setElementPanelShow(false)} style={elementsPanelProps} />}
      </Stack>
    </OperatorContext.Provider>
  );
};
