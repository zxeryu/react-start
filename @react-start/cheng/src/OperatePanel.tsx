import React, { createContext, useCallback, useContext } from "react";
import { IOperateElementItem, SetProp } from "./types";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import { map } from "lodash";

const OSetPropsContext = createContext<{
  setProp: (propKey: string, prop: any) => void;
}>({} as any);

export const useSetProp = () => useContext(OSetPropsContext);

const BooleanSet = ({ name, propKey }: SetProp & { propKey: string }) => {
  const { setProp } = useSetProp();
  return (
    <FormControlLabel
      control={<Checkbox />}
      label={name}
      onChange={(_, checked) => {
        setProp(propKey, checked);
      }}
    />
  );
};

export const OperatePanel = ({ oel, onChange }: { oel: IOperateElementItem; onChange?: () => void }) => {
  const setProp = useCallback((key: string, value: any) => {
    console.log("@@@@@@@@@@", key, value, oel);
    onChange && onChange();
  }, []);

  return (
    <OSetPropsContext.Provider value={{ setProp }}>
      <div>
        {map(oel.setProps, (prop, key) => {
          if (prop.type === "boolean") {
            return <BooleanSet propKey={key} {...prop} />;
          }
          return null;
        })}
      </div>
    </OSetPropsContext.Provider>
  );
};
