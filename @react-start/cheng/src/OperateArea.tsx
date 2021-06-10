/**
 * 操作区域
 */
import React, {
  cloneElement,
  createContext,
  CSSProperties,
  Dispatch,
  isValidElement,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { IElementItem, IOperateElementItem } from "./types";
import { PropFun, useDrop, useDrag } from "@react-start/hooks";
import { PlaceholderElement, StackElement } from "./Elements";
import { debounce, get, map, filter } from "lodash";
import { useOperator } from "./Compose";
import { Stack } from "@material-ui/core";
import { OperatePanel } from "./OperatePanel";

const SubOperatorContext = createContext<{
  //当前拖动的Element from：left
  dragElement?: IElementItem;
  //当前内部拖动元素 oid
  currentOElementID?: string;
  //可拖动的方法
  getDragProps: PropFun<string>;
  //设置拖动元素的方法
  setDragElement: Dispatch<SetStateAction<IElementItem | undefined>>;
}>({} as any);

const useSubOperator = () => useContext(SubOperatorContext);

export const OperateItem = ({ oel, onClick }: { oel: IOperateElementItem; onClick?: () => void }) => {
  const { dragElement, currentOElementID, getDragProps } = useSubOperator();

  if (!isValidElement(oel.menuElement)) {
    return null;
  }

  if (oel.oid === PlaceholderElement.oid) {
    return cloneElement(oel.menuElement, {
      "data-oid": oel.oid,
      children: dragElement?.menuElement,
    });
  }
  return cloneElement(oel.menuElement, {
    "data-oid": oel.oid,
    "data-id": oel.id,
    data: oel,
    ...(get(oel, "directShow", true) ? getDragProps(oel.oid) : null),
    style: {
      borderTop: currentOElementID === oel.oid ? "2px solid blue" : "none",
    },
    onClick: () => {
      onClick && onClick();
    },
  });
};

export const OperateArea = ({
  operateAreaProps,
  operatePanelProps,
  operateExtra,
}: {
  operatePanelProps?: CSSProperties;
  operateAreaProps?: CSSProperties;
  operateExtra?: IOperateElementItem[];
}) => {
  const { data, operator, hoveringRef } = useOperator();

  //当前拖动的element
  const [dragElement, setDragElement] = useState<IElementItem>();

  //内部拖动调整位置 id
  const [currentOElementID, setCurrentOElementID] = useState<string>();

  //hover元素oid
  const [locOID, setLocOID] = useState<string>();
  const locIDRef = useRef<string>();
  const debounceSetLocOID = useCallback(
    debounce((oid: string, id: string) => {
      setLocOID(oid);
      locIDRef.current = id;
    }, 10),
    [],
  );

  const [dropProps, { isHovering }] = useDrop<string>({
    onDom: (id) => {
      if (dragElement) {
        if (locIDRef.current === StackElement.id) {
          operator.addElementById(id, undefined, locOID);
        } else {
          operator.addElementById(id, locOID);
        }
      }
    },
    onDragOver: (e) => {
      const id = get(e.target, ["dataset", "id"]);
      const oid = get(e.target, ["dataset", "oid"]);

      if (oid === PlaceholderElement.oid) {
        return;
      }
      oid && debounceSetLocOID(oid, id);
    },
  });

  hoveringRef.current = isHovering;

  //左侧拖动添加
  useEffect(() => {
    if (dragElement && isHovering) {
      operator.addElement(PlaceholderElement);
    } else {
      operator.removeElement(PlaceholderElement.oid);
      setLocOID(undefined);
    }
  }, [dragElement, isHovering]);

  //移动元素
  useEffect(() => {
    if (!isHovering) {
      return;
    }
    if (dragElement && locOID) {
      if (locIDRef.current === StackElement.id) {
        return;
      }
      operator.arrayMoveById(PlaceholderElement.oid, locOID);
      return;
    }
    if (currentOElementID && locOID) {
      operator.arrayMoveById(currentOElementID, locOID, locIDRef.current === StackElement.id);
    }
  }, [dragElement, currentOElementID, locOID, isHovering]);

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

  const [currentOEL, setCurrentOEL] = useState<IOperateElementItem[]>([]);

  return (
    <SubOperatorContext.Provider
      value={{
        dragElement,
        currentOElementID,
        getDragProps,
        setDragElement,
      }}>
      <Stack style={{ position: "relative", ...operateAreaProps }}>
        <Stack {...dropProps}>
          {map(data, (oel) => (
            <OperateItem
              key={oel.oid}
              oel={oel}
              onClick={() => {
                setCurrentOEL((prevState) => [...prevState, oel]);
              }}
            />
          ))}
        </Stack>

        <Stack>
          {map(operateExtra, (oel) => (
            <OperateItem
              key={oel.oid}
              oel={oel}
              onClick={() => {
                setCurrentOEL((prevState) => [...prevState, oel]);
              }}
            />
          ))}
        </Stack>
        {map(currentOEL, (oel) => (
          <OperatePanel
            key={oel.oid}
            style={operatePanelProps}
            oel={oel}
            onClose={(oid) => setCurrentOEL((prevState) => filter(prevState, (oel) => oel.oid !== oid))}
            onOpen={(oel) => {
              setCurrentOEL((prevState) => [...prevState, oel]);
            }}
          />
        ))}
      </Stack>
    </SubOperatorContext.Provider>
  );
};
