import React, { HTMLAttributes } from "react";
import { DragOperator, IElementItem } from "@react-start/drag";

type Props = HTMLAttributes<HTMLDivElement>;

const ElementOne = (props: Props) => {
  return <div {...props}>ElementOne</div>;
};

const ElementTwo = (props: Props) => {
  return <div {...props}>ElementTwo</div>;
};

const ElementThree = (props: Props) => {
  return <div {...props}>ElementThree</div>;
};

const elements: IElementItem[] = [
  { showElement: <ElementOne />, setProps: {}, name: "ElementOne" },
  { showElement: <ElementTwo />, setProps: {}, name: "ElementTwo" },
  { showElement: <ElementThree />, setProps: {}, name: "ElementThree" },
];

export const DragOperatorDemo = () => {
  return (
    <div>
      <DragOperator elements={elements} />
    </div>
  );
};
