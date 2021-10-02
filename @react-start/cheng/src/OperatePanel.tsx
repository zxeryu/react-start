import React, {
  createContext,
  FunctionComponent,
  useCallback,
  useContext,
  isValidElement,
  cloneElement,
  CSSProperties,
  useState,
} from "react";
import { IElementItem, IOperateElementItem, SetProp } from "./types";
import { IconButton, Stack, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import { map, get, size } from "lodash";
import { BooleanSet, NumberSet, SelectSet, SetProps, StringSet } from "./input";
import { useOperator } from "./Operator";
import { Item } from "./component";
import { ElementListSet, ElementSet } from "./input/ElementSet";
import { getOelName } from "./OperateArea";

const OSetPropsContext = createContext<{
  oel: IOperateElementItem;
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
  element: ElementSet,
  elementList: ElementListSet,
};

export const SetPropList = ({ setProps, data }: { setProps: IElementItem["setProps"]; data: any }) => {
  const { extraSetElementMap } = useOperator();

  return (
    <Stack direction={"column"} className={"OperatePanelItemStack"} spacing={1}>
      {map(setProps, (prop, propKey) => {
        if (prop.element && isValidElement(prop.element)) {
          return cloneElement(prop.element, { key: propKey, value: get(data, propKey) });
        }
        const elementKey = getSetElementKey(prop.inputType, prop.type);
        const SetElement = get(extraSetElementMap, elementKey) || get(SetElementMap, elementKey);

        if (elementKey === "object") {
          return <ObjectSet key={propKey} objectProp={prop} objectPropKey={propKey} value={get(data, propKey)} />;
        }

        if (!SetElement) {
          return (
            <div key={propKey + prop.name} style={{ paddingTop: 8 }}>
              {prop.name}
            </div>
          );
        }

        return <SetElement key={propKey} propKey={propKey} {...prop} value={get(data, propKey)} />;
      })}
    </Stack>
  );
};

export const ObjectSet = ({
  objectProp,
  objectPropKey,
  value,
}: {
  objectProp: SetProp;
  objectPropKey: string;
  value: any;
}) => {
  const { oel, setProp } = useSetProp();

  const [open, setOpen] = useState<boolean>(false);

  const [data, setData] = useState<Record<string, any>>(value || {});

  const setPropObject = useCallback((key: string, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <>
      <Button fullWidth onClick={() => setOpen(true)}>
        {objectProp.name}
      </Button>
      <Dialog open={open} fullWidth maxWidth={"sm"}>
        <DialogTitle>{objectProp.name}</DialogTitle>
        <DialogContent>
          <OSetPropsContext.Provider value={{ oel, setProp: setPropObject }}>
            <SetPropList setProps={objectProp.subSetProp} data={data} />
          </OSetPropsContext.Provider>
        </DialogContent>
        <DialogActions>
          <Button variant={"outlined"} onClick={() => setOpen(false)}>
            取消
          </Button>
          <Button
            variant={"contained"}
            onClick={() => {
              if (objectPropKey) {
                setProp(objectPropKey, data);
              }
              setOpen(false);
            }}>
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export const OperatePanel = ({ oel, onClose, onOpen, style }: OperatePanelProps) => {
  const { setPropDataWithEmitChange, onExtraChange } = useOperator();
  const setProp = useCallback((key: string, value: any) => {
    //extra
    const isExtra = get(oel, "isExtra");
    if (isExtra) {
      onExtraChange && onExtraChange(oel.id || oel.oid, key, value);
      return;
    }
    //data
    setPropDataWithEmitChange(oel.oid, key, value);
  }, []);

  return (
    <OSetPropsContext.Provider value={{ oel, setProp }}>
      <Stack
        className={"OperatePanel"}
        direction={"column"}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: "white",
          overflowY: "auto",
          ...style,
        }}>
        <div style={{ lineHeight: "40px" }}>{getOelName(oel)}</div>

        <IconButton style={{ position: "absolute", top: 0, right: 0 }} onClick={() => onClose(oel.oid)}>
          <CloseIcon />
        </IconButton>

        {oel.setElement && isValidElement(oel.setElement) ? (
          cloneElement(oel.setElement, { data: oel })
        ) : (
          <SetPropList setProps={oel.setProps} data={oel.props} />
        )}

        {size(oel.elementList) > 0 && (
          <>
            <div>children:</div>
            {map(oel.elementList, (oel) => (
              <Item key={oel.oid} label={oel.name} onClick={() => onOpen && onOpen(oel)} />
            ))}
          </>
        )}
      </Stack>
    </OSetPropsContext.Provider>
  );
};
