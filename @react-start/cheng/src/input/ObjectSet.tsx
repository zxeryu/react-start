import { SetProp } from "../types";
import React, { useCallback, useState } from "react";
import { Button } from "@material-ui/core";
import { OSetPropsContext, SetPropList, useSetProp } from "../OperatePanel";
import { Dialog, SubTitle } from "../component";
import { get } from "lodash";
import { OPERATE_CONFIG_NAME } from "../OperateArea";

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

  const name = get(value, OPERATE_CONFIG_NAME) || objectProp.name;

  return (
    <>
      <SubTitle label={name} />
      <Button fullWidth onClick={() => setOpen(true)}>
        设置对象
      </Button>
      <Dialog
        open={open}
        title={name}
        onClose={() => {
          setOpen(false);
        }}
        onOk={() => {
          if (objectPropKey) {
            setProp(objectPropKey, data);
          }
          setOpen(false);
        }}>
        <OSetPropsContext.Provider value={{ oel, setProp: setPropObject }}>
          <SetPropList setProps={objectProp.subSetProp} data={data} />
        </OSetPropsContext.Provider>
      </Dialog>
    </>
  );
};
