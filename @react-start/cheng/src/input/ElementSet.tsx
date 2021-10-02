import React, { useMemo, useRef, useState } from "react";
import { IOperateElementItem } from "../types";
import { isFunction, size, get } from "lodash";
import { useSetProp } from "../OperatePanel";
import { OPERATE_CONFIG_NAME, OperateContent } from "../OperateArea";

export const ElementSet = (props: any) => {
  const { setProp } = useSetProp();

  const [data, setData] = useState<IOperateElementItem[]>(props.value ? [props.value] : []);
  const dataRef = useRef<IOperateElementItem[]>(data);
  dataRef.current = data;

  const isShowAddTrigger = useMemo(() => size(data) === 0, [data]);

  return (
    <div>
      <div style={{ paddingBottom: 4 }}>{get(props.value, OPERATE_CONFIG_NAME) || get(props, "name")}</div>
      <OperateContent
        isShowAddTrigger={isShowAddTrigger}
        isChild
        data={data}
        setData={setData}
        setDataWithEmitChange={(value) => {
          const nextData = isFunction(value) ? value(dataRef.current) : value;
          setData(nextData);
          if (props.propKey) {
            setProp(props.propKey, size(nextData) > 0 ? nextData[0] : undefined);
          }
        }}
      />
    </div>
  );
};

export const ElementListSet = (props: any) => {
  const { setProp } = useSetProp();

  const [data, setData] = useState<IOperateElementItem[]>(props.value || []);
  const dataRef = useRef<IOperateElementItem[]>(data);
  dataRef.current = data;

  return (
    <div>
      <div style={{ paddingBottom: 4 }}>{get(props.value, OPERATE_CONFIG_NAME) || get(props, "name")}</div>
      <OperateContent
        isShowAddTrigger
        isChild
        data={data}
        setData={setData}
        setDataWithEmitChange={(value) => {
          const nextData = isFunction(value) ? value(dataRef.current) : value;
          setData(nextData);
          if (props.propKey) {
            setProp(props.propKey, nextData);
          }
        }}
      />
    </div>
  );
};
