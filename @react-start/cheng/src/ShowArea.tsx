/**
 * 显示内容
 */
import React, { cloneElement, CSSProperties, isValidElement } from "react";
import { useOperator } from "./Operator";
import { Stack } from "@material-ui/core";
import { IOperateElementItem } from "./types";
import { map } from "lodash";

export const ShowItem = ({ oel }: { oel: IOperateElementItem }) => {
  if (!isValidElement(oel.showElement)) {
    return null;
  }

  return cloneElement(oel.showElement, { data: oel });
};

export type ShowAreaProps = CSSProperties;

export const ShowArea = (props: ShowAreaProps) => {
  const { data } = useOperator();

  return (
    <Stack style={props}>
      {map(data, (oel) => (
        <ShowItem key={oel.oid} oel={oel} />
      ))}
    </Stack>
  );
};
