/**
 * 显示内容
 */
import React, { cloneElement, isValidElement } from "react";
import { useOperator } from "./Compose";
import { Stack } from "@material-ui/core";
import { IOperateElementItem } from "./types";
import { map } from "lodash";

export const ShowItem = ({ oel }: { oel: IOperateElementItem }) => {
  if (!isValidElement(oel.showElement)) {
    return null;
  }

  return cloneElement(oel.showElement, { data: oel });
};

export const ShowArea = () => {
  const { data } = useOperator();

  return (
    <Stack>
      {map(data, (oel) => (
        <ShowItem key={oel.oid} oel={oel} />
      ))}
    </Stack>
  );
};
