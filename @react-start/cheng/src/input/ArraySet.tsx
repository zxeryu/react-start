import React, { useCallback, useRef, useState } from "react";
import { Button, Stack, IconButton } from "@material-ui/core";
import { Edit, Delete } from "@material-ui/icons";
import { OSetPropsContext, SetPropList, useSetProp } from "../OperatePanel";
import { ISetProps } from "../types";
import { Dialog, SubTitle } from "../component";
import { isNumber, map, filter, get } from "lodash";
import { OPERATE_CONFIG_NAME } from "../OperateArea";

export const ArraySet = ({
  name,
  propKey,
  subSetProp,
  value,
}: {
  name: string;
  propKey: string;
  value: any;
  subSetProp: ISetProps;
}) => {
  const { oel, setProp } = useSetProp();
  const [open, setOpen] = useState<boolean>(false);

  const indexRef = useRef<number>();
  const currentRef = useRef<any>();

  const [data, setData] = useState<any[]>(value || []);

  const setPropArray = useCallback((key: string, value: any) => {
    currentRef.current = { ...currentRef.current, [key]: value };
  }, []);

  const handleSubmit = useCallback(() => {
    const nextData = [...data];
    if (isNumber(indexRef.current)) {
      nextData.splice(indexRef.current, 1, currentRef.current);
    } else {
      nextData.push(currentRef.current);
    }
    setData(nextData);
    if (propKey) {
      setProp(propKey, nextData);
    }
    setOpen(false);
  }, [data]);

  return (
    <>
      <SubTitle style={{ paddingBottom: 4 }} label={get(value, OPERATE_CONFIG_NAME) || name} />
      {map(data, (item, index) => (
        <Stack direction={"row"} style={{ justifyContent: "space-between", alignItems: "center" }}>
          <span>item-{index + 1}</span>
          <div>
            <IconButton
              onClick={() => {
                setOpen(true);
                currentRef.current = item;
                indexRef.current = index;
              }}>
              <Edit fontSize={"small"} />
            </IconButton>
            <IconButton
              onClick={() => {
                setData((prev) => {
                  return filter(prev, (_, i) => i !== index);
                });
              }}>
              <Delete fontSize={"small"} />
            </IconButton>
          </div>
        </Stack>
      ))}
      <Button
        fullWidth
        onClick={() => {
          setOpen(true);
          currentRef.current = undefined;
          indexRef.current = undefined;
        }}>
        添加item
      </Button>
      {open && (
        <Dialog
          open
          onClose={() => {
            setOpen(false);
            currentRef.current = undefined;
          }}
          onOk={handleSubmit}>
          <OSetPropsContext.Provider value={{ oel, setProp: setPropArray }}>
            <SetPropList setProps={subSetProp} data={currentRef.current} />
          </OSetPropsContext.Provider>
        </Dialog>
      )}
    </>
  );
};
