import React from "react";
import { Stack, CircularProgress, StackProps, CircularProgressProps } from "@material-ui/core";

export const DefaultCircularRadius = 28;

export const Loading = ({
  ProgressProps,
  style,
  ...props
}: StackProps & {
  ProgressProps?: CircularProgressProps;
}) => {
  return (
    <Stack
      style={{
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 3,
        backgroundColor: "rgba(255, 255, 255, 0.6)",
        ...style,
      }}
      {...props}>
      <CircularProgress size={DefaultCircularRadius} {...ProgressProps} />
    </Stack>
  );
};
