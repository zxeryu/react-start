import React, { HTMLProps, ReactNode } from "react";

export const Item = ({ label, style, ...otherProps }: HTMLProps<HTMLDivElement> & { label?: ReactNode }) => {
  return (
    <div
      className={"NormalItem"}
      style={{
        cursor: "pointer",
        ...style,
      }}
      {...otherProps}>
      {label}
    </div>
  );
};
