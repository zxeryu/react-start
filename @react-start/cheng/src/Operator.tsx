import { IElementItem, IOperateElementItem } from "./types";
import React, {
  createContext,
  CSSProperties,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { OperatePanel, OperatePanelProps } from "./OperatePanel";
import { isFunction, map, filter, size, isEmpty } from "lodash";
import { Stack } from "@material-ui/core";
import { OperateArea } from "./OperateArea";
import { Item } from "./component";
import { ElementsPanel } from "./ElementsPanel";
import { generateId } from "./util";
import { findTarget } from "./utilities";

type TValue = IOperateElementItem[] | ((prevState: IOperateElementItem[]) => IOperateElementItem[]);

export interface OperatorProps {
  operateElements: IOperateElementItem[];
  elements?: IElementItem[];
  extraOperateElements?: IOperateElementItem[];
  extraSetElementMap?: OperatePanelProps["extraSetElementMap"];
  //
  onExtraChange?: (id: string, key: string, value: any) => void;
  onChange?: (data: IOperateElementItem[]) => void;
  onDragChange?: () => void;
  onItemClick?: (oel: IOperateElementItem) => void;
  //
  style?: CSSProperties;
  children?: ReactNode;
}

export interface OperatorContextProps extends Pick<OperatorProps, "elements" | "extraSetElementMap" | "onExtraChange"> {
  //操作对象
  data: IOperateElementItem[];
  //改变data对象
  setData: Dispatch<SetStateAction<IOperateElementItem[]>>;
  //改变data对象，并触发onChange事件
  setDataWithEmitChange: (value: TValue) => void;
  //改变单个属性
  setPropDataWithEmitChange: (oid: string, key: string, value: any) => void;
  //打开添加元素弹窗
  openElementsPanel: () => void;
  //打开的OperatePanels
  operatePanels: IOperateElementItem[];
  //重置operatePanels
  setOperatePanel: (oel: IOperateElementItem) => void;
  //添加operatePanels
  addOperatePanel: (oel: IOperateElementItem) => void;
}

const OperatorContext = createContext<OperatorContextProps>({} as any);

export const useOperator = () => useContext(OperatorContext);

export const Operator = ({
  operateElements,
  elements,
  extraOperateElements,
  extraSetElementMap,
  //
  onExtraChange,
  onChange,
  // onDragChange,
  onItemClick,
  //
  style,
  children,
  //
  ...otherProps
}: OperatorProps) => {
  const [data, setData] = useState<IOperateElementItem[]>(operateElements);
  useEffect(() => {
    setData(operateElements);
  }, [operateElements]);
  const dataRef = useRef<IOperateElementItem[]>(operateElements);
  dataRef.current = data;

  const setDataWithEmitChange = useCallback((value: TValue) => {
    const nextData = isFunction(value) ? value(dataRef.current) : value;
    setData(nextData);
    onChange && onChange(nextData);
  }, []);

  //设置单个属性
  const setPropDataWithEmitChange = useCallback((oid: string, key: string, value: any) => {
    const nextData = [...dataRef.current];
    findTarget(nextData, oid, (arr, index) => {
      const item = arr[index];
      arr[index] = { ...item, props: { ...item.props, [key]: value } };
    });
    setData(nextData);
    onChange && onChange(nextData);
  }, []);

  //************************************ extra panels ******************************************
  const [extraPanels, setExtraPanels] = useState<IOperateElementItem[]>([]);

  const addExtraPanel = useCallback((oel: IOperateElementItem) => {
    setExtraPanels((prev) => [...prev, oel]);
  }, []);

  //************************************ current panels ******************************************
  const [operatePanels, setOperatePanels] = useState<IOperateElementItem[]>([]);

  const setOperatePanel = useCallback((oel: IOperateElementItem) => {
    if (!isEmpty(oel.setProps) || oel.setElement || size(oel.elementList) > 0) {
      setOperatePanels([oel]);
    } else {
      setOperatePanels([]);
    }
  }, []);

  const addOperatePanel = useCallback((oel: IOperateElementItem) => {
    if (!isEmpty(oel.setProps) || oel.setElement || size(oel.elementList) > 0) {
      setOperatePanels((prev) => [...prev, oel]);
    }
  }, []);

  //************************************ elements panel ******************************************

  const [elementPanelShow, setElementPanelShow] = useState<boolean>(false);

  const openElementsPanel = useCallback(() => setElementPanelShow(true), []);

  return (
    <OperatorContext.Provider
      value={{
        //prop
        elements,
        extraSetElementMap,
        onExtraChange,
        //
        data,
        setData,
        setDataWithEmitChange,
        setPropDataWithEmitChange,
        openElementsPanel,
        operatePanels,
        setOperatePanel,
        addOperatePanel,
      }}>
      <Stack style={{ height: "100%", ...style }} direction={"row"} {...otherProps}>
        <Stack
          className={"LeftArea"}
          style={{ position: "relative", width: 300, minWidth: 300, height: "100%" }}
          direction={"column"}>
          <OperateArea
            onItemClick={(oel) => {
              onItemClick && onItemClick(oel);
            }}
          />

          <Stack className={"LeftAreaBottom"}>
            {size(elements) > 0 && <Item label={"添加元素"} onClick={() => openElementsPanel()} />}
            {map(extraOperateElements, (extraOEL) => (
              <Item key={extraOEL.oid} label={extraOEL.name} onClick={() => addExtraPanel(extraOEL)} />
            ))}
          </Stack>

          {map(extraPanels, (oel) => (
            <OperatePanel
              key={oel.oid}
              oel={oel}
              onClose={(oid) => {
                setExtraPanels((prev) => filter(prev, (o) => o.oid !== oid));
              }}
              onOpen={(oel) => addExtraPanel(oel)}
            />
          ))}

          {elementPanelShow && (
            <ElementsPanel
              onClose={() => setElementPanelShow(false)}
              onSuccess={(el) => {
                const addOEL: IOperateElementItem = { ...el, oid: generateId() };
                setDataWithEmitChange([...dataRef.current, addOEL]);
                setElementPanelShow(false);
              }}
            />
          )}
        </Stack>
        <Stack direction={"row"} style={{ flexGrow: 1, justifyContent: "center" }}>
          {children}
        </Stack>
        {size(operatePanels) > 0 && (
          <Stack
            className={"RightArea"}
            style={{
              position: "relative",
              width: 300,
              minWidth: 300,
              height: "100%",
            }}>
            {map(operatePanels, (oel) => (
              <OperatePanel
                key={oel.oid}
                oel={oel}
                onClose={(oid) => {
                  console.log("########", operatePanels);
                  setOperatePanels((prev) => filter(prev, (o) => o.oid !== oid));
                }}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </OperatorContext.Provider>
  );
};
