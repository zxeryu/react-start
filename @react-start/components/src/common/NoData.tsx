import React from "react";
import { Stack, StackProps } from "@material-ui/core";

export const NoData = ({ style, ...props }: StackProps) => {
  return (
    <Stack style={{ justifyContent: "center", alignItems: "center", padding: 10, opacity: 0.6, ...style }} {...props}>
      暂无数据
    </Stack>
  );
};
