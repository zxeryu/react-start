import React, {
  createContext,
  FunctionComponent,
  useCallback,
  useContext,
  isValidElement,
  cloneElement,
  CSSProperties,
} from "react";
import { IOperateElementItem } from "./types";
import { IconButton, Stack } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import { map, get, size } from "lodash";
import { useOperator } from "./Operator";
import { BooleanSet, NumberSet, SelectSet, SetProps, StringSet } from "./input/basic";

const OSetPropsContext = createContext<{
  setProp: (propKey: string, prop: any) => void;
}>({} as any);

export const useSetProp = () => useContext(OSetPropsContext);

const getSetElementKey = (inputType?: SetProps["inputType"], type?: SetProps["type"]): string => {
  if (type === "boolean") {
    return "boolean";
  } else if (inputType === "select") {
    return "select";
  } else if (inputType === "input") {
    if (type === "number") {
      return "number";
    }
    return "string";
  }
  return type || "";
};

export interface OperatePanelProps {
  oel: IOperateElementItem;
  onClose: (oid: string) => void;
  onOpen?: (oel: IOperateElementItem) => void;
  style?: CSSProperties;
  onExtraChange?: (id: string, key: string, value: any) => void;
  extraSetElementMap?: { [key: string]: FunctionComponent<any> };
}

const SetElementMap: OperatePanelProps["extraSetElementMap"] = {
  select: SelectSet,
  string: StringSet,
  number: NumberSet,
  boolean: BooleanSet,
};

export const OperatePanel = ({ oel, onClose, onOpen, style, onExtraChange, extraSetElementMap }: OperatePanelProps) => {
  const { operator, changeRef } = useOperator();
  const setProp = useCallback((key: string, value: any) => {
    //extra
    const isExtra = get(oel, "isExtra");
    if (isExtra) {
      onExtraChange && onExtraChange(oel.id || oel.oid, key, value);
      return;
    }
    //data
    changeRef.current = true;
    operator.setData((prevState) => {
      return map(prevState, (item) => {
        if (item.oid === oel.oid) {
          item.props = { ...item.props, [key]: value };
          return item;
        }
        return item;
      });
    });
  }, []);

  return (
    <OSetPropsContext.Provider value={{ setProp }}>
      <Stack
        direction={"column"}
        spacing={"10px"}
        style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, backgroundColor: "white", ...style }}>
        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
          <div>{oel.name}</div>
          <IconButton onClick={() => onClose(oel.oid)}>
            <CloseIcon />
          </IconButton>
        </Stack>

        {oel.setElement && isValidElement(oel.setElement)
          ? cloneElement(oel.setElement, { data: oel })
          : map(oel.setProps, (prop, propKey) => {
              if (prop.element && isValidElement(prop.element)) {
                return cloneElement(prop.element, { key: propKey, value: get(oel.props, propKey) });
              }

              const elementKey = getSetElementKey(prop.inputType, prop.type);
              const SetElement = get({ ...SetElementMap, ...extraSetElementMap }, elementKey);

              if (!SetElement) {
                return prop.name;
              }
              return <SetElement key={propKey} propKey={propKey} {...prop} value={get(oel.props, propKey)} />;
            })}

        {size(oel.elementList) > 0 &&
          map(oel.elementList, (oel) => (
            <div key={oel.oid} onClick={() => onOpen && onOpen(oel)}>
              {oel.name}
            </div>
          ))}
      </Stack>
    </OSetPropsContext.Provider>
  );
};
