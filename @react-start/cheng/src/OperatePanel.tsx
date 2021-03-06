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
import { IOperateElementItem, SetProp } from "./types";
import { Checkbox, FormControlLabel, IconButton, Stack, TextField, MenuItem } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import { map, get, isNumber, size } from "lodash";
import { useOperator } from "./Compose";

const OSetPropsContext = createContext<{
  setProp: (propKey: string, prop: any) => void;
}>({} as any);

export const useSetProp = () => useContext(OSetPropsContext);

interface SetProps extends SetProp {
  propKey: string;
  value?: any;
}

export const BooleanSet = ({ name, propKey, value }: SetProps) => {
  const { setProp } = useSetProp();

  const [checked, setChecked] = useState<boolean>(value);

  return (
    <FormControlLabel
      checked={checked}
      control={<Checkbox />}
      label={name}
      onChange={(e) => {
        setProp(propKey, (e.target as any).checked);
        setChecked((e.target as any).checked);
      }}
    />
  );
};

export const NumberSet = ({ name, propKey, value }: SetProps) => {
  const { setProp } = useSetProp();

  return (
    <TextField
      size={"small"}
      type={"number"}
      label={name}
      // value={value}
      defaultValue={value}
      onChange={(e) => {
        setProp(propKey, e.target.value);
      }}
    />
  );
};

export const StringSet = ({ name, propKey, value, rows }: SetProps) => {
  const { setProp } = useSetProp();

  return (
    <TextField
      size={"small"}
      multiline={!!isNumber(rows)}
      rows={rows}
      label={name}
      // value={value}
      defaultValue={value}
      // onChange={(e) => {
      //   setProp(propKey, e.target.value);
      // }}
      onBlur={(e) => {
        setProp(propKey, e.target.value);
      }}
    />
  );
};

export const SelectSet = ({ name, propKey, value, chooseValue }: SetProps) => {
  const { setProp } = useSetProp();

  return (
    <TextField
      size={"small"}
      select
      fullWidth
      label={name}
      value={value}
      onChange={(e) => {
        setProp(propKey, e.target.value);
      }}>
      {map(chooseValue, (item) => (
        <MenuItem key={item} value={item}>
          {item}
        </MenuItem>
      ))}
    </TextField>
  );
};

const SetElementMap: { [key: string]: FunctionComponent<any> } = {
  select: SelectSet,
  string: StringSet,
  number: NumberSet,
  boolean: BooleanSet,
};

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
  return "";
};

export const OperatePanel = ({
  oel,
  onClose,
  onOpen,
  style,
  onExtraChange,
}: {
  oel: IOperateElementItem;
  onClose: (oid: string) => void;
  onOpen?: (oel: IOperateElementItem) => void;
  style?: CSSProperties;
  onExtraChange?: (id: string, key: string, value: any) => void;
}) => {
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
              const SetElement = get(SetElementMap, elementKey);
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
