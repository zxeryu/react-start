import React, { HTMLProps, ReactNode } from "react";

export const Item = ({ label, style, ...otherProps }: HTMLProps<HTMLDivElement> & { label?: ReactNode }) => {
  return (
    <div
      style={{
        padding: "6px 10px",
        cursor: "pointer",
        ...style,
      }}
      {...otherProps}>
      {label}
    </div>
  );
};
