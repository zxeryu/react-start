import React, { useMemo, useRef, useState } from "react";
import { IOperateElementItem } from "../types";
import { isFunction, size, get, map, filter } from "lodash";
import { OperateSetContent, OSetPropsContext, useSetProp } from "../OperatePanel";
import { getOelName, OPERATE_CONFIG_NAME, OperateContent } from "../OperateArea";
import { Dialog, SubTitle } from "../component";
import { useOperator } from "../Operator";
import { findTarget, isValidOperate } from "../utilities";

const BaseElementSet = ({ single, ...props }: any) => {
  const { onItemClick } = useOperator();
  const { setProp } = useSetProp();

  const [data, setData] = useState<IOperateElementItem[]>(() => {
    if (!props.value) {
      return [];
    }
    return single ? [props.value] : props.value;
  });
  const dataRef = useRef<IOperateElementItem[]>(data);
  dataRef.current = data;

  const isShowAddTrigger = useMemo(() => {
    if (single) {
      return size(data) === 0;
    }
    return true;
  }, [data]);

  const [operateDialogs, setOperateDialogs] = useState<IOperateElementItem[]>([]);

  return (
    <div>
      <SubTitle label={get(props.value, OPERATE_CONFIG_NAME) || get(props, "name")} />
      <OperateContent
        isShowAddTrigger={isShowAddTrigger}
        data={data}
        setData={setData}
        setDataWithEmitChange={(value) => {
          const nextData = isFunction(value) ? value(dataRef.current) : value;
          setData(nextData);
          if (props.propKey) {
            if (single) {
              setProp(props.propKey, size(nextData) > 0 ? nextData[0] : undefined);
            } else {
              setProp(props.propKey, nextData);
            }
          }
        }}
        onItemClick={(oel) => {
          onItemClick && onItemClick(oel);

          if (isValidOperate(oel)) {
            setOperateDialogs([oel]);
          } else {
            setOperateDialogs([]);
          }
        }}
      />

      {map(operateDialogs, (oel) => {
        const setPropElement = (key: string, value: any) => {
          const nextData = [...dataRef.current];
          findTarget(nextData, oel.oid, (arr, index) => {
            const item = arr[index];
            arr[index] = { ...item, props: { ...item.props, [key]: value } };
          });
          setData(nextData);
          if (props.propKey) {
            if (single) {
              setProp(props.propKey, size(nextData) > 0 ? nextData[0] : undefined);
            } else {
              setProp(props.propKey, nextData);
            }
          }
        };
        return (
          <Dialog
            key={oel.oid}
            open
            noFooter
            title={getOelName(oel)}
            onClose={() => {
              setOperateDialogs((prev) => filter(prev, (o) => o.oid !== oel.oid));
            }}>
            <OSetPropsContext.Provider value={{ oel, setProp: setPropElement }}>
              <OperateSetContent
                oel={oel}
                onOpen={(subOel) => {
                  if (isValidOperate(subOel)) {
                    setOperateDialogs((prev) => [...prev, subOel]);
                  }
                }}
              />
            </OSetPropsContext.Provider>
          </Dialog>
        );
      })}
    </div>
  );
};

export const ElementSet = (props: any) => {
  return <BaseElementSet single {...props} />;
};

export const ElementListSet = (props: any) => {
  return <BaseElementSet {...props} />;
};
