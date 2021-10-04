import React, { useState } from "react";
import { Button, Stack, IconButton } from "@material-ui/core";
import { ContentCopy, Delete } from "@material-ui/icons";
import { OSetPropsContext, SetPropList, useSetProp } from "../OperatePanel";
import { Dialog, SubTitle } from "../component";
import { map, filter, get } from "lodash";

export const BaseArraySet = (props: any) => {
  const { oel, setProp } = useSetProp();
  const [open, setOpen] = useState<boolean>(false);

  const [data, setData] = useState<any[]>(() => {
    if (!props.value) {
      return [];
    }
    if (props.single) {
      return map(props.value, (i) => i.value);
    }
    return props.value;
  });

  return (
    <>
      <SubTitle label={get(props, "name")} />
      <Button fullWidth onClick={() => setOpen(true)}>
        设置数组
      </Button>
      <Dialog
        open={open}
        title={props.name}
        outClosable={false}
        onClose={() => setOpen(false)}
        onOk={() => {
          //设置props
          if (props.propKey) {
            if (props.single) {
              setProp(
                props.propKey,
                map(data, (i) => i.value),
              );
            } else {
              setProp(props.propKey, data);
            }
          }

          setOpen(false);
        }}>
        {map(data, (item, index) => {
          const setPropArray = (key: string, value: any) => {
            setData((prev) => {
              return map(prev, (sub, i) => {
                if (i === index) {
                  return { ...sub, [key]: value };
                }
                return sub;
              });
            });
          };
          return (
            <div>
              <Stack direction={"row"} style={{ alignItems: "center", justifyContent: "space-between" }}>
                <div>{index + 1}</div>
                <div>
                  <IconButton
                    onClick={() => {
                      setData((prev) => [...prev, item]);
                    }}>
                    <ContentCopy fontSize={"small"} />
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
              <OSetPropsContext.Provider value={{ oel, setProp: setPropArray }}>
                <SetPropList setProps={props.subSetProp} data={item} />
              </OSetPropsContext.Provider>
            </div>
          );
        })}
        <Button fullWidth onClick={() => setData((prev) => [...prev, {}])}>
          添加
        </Button>
      </Dialog>
    </>
  );
};

export const ArraySet = (props: any) => <BaseArraySet {...props} />;

export const ArraySingleSet = (props: any) => <BaseArraySet single {...props} />;
