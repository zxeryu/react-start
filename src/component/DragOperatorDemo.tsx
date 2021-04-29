import React, { HTMLAttributes } from "react";
import { DragOperator, IElementItem } from "@react-start/drag";
import { get } from "lodash";

type Props = HTMLAttributes<HTMLDivElement>;

const ElementOne = (props: Props) => {
  return <div {...props}>ElementOne {get(props, ["data-oid"])}</div>;
};

const ElementTwo = (props: Props) => {
  return <div {...props}>ElementTwo {get(props, ["data-oid"])}</div>;
};

const ElementThree = (props: Props) => {
  return <div {...props}>ElementThree {get(props, ["data-oid"])}</div>;
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
