import React, { HTMLAttributes } from "react";
import { IElementItem, Operator } from "@react-start/cheng";
import { OperateElementItemProp } from "../../@react-start/cheng/src";

const Menu = ({ label, ...otherProps }: { label: string }) => (
  <div {...otherProps} style={{ padding: "5px 8px" }}>
    {label}
  </div>
);

type Props = HTMLAttributes<HTMLDivElement> & { data?: OperateElementItemProp };

const ElementOne = ({ data, ...props }: Props) => {
  return (
    <div {...props}>
      ElementOne content
      {data?.props?.showOne && <div>1---1</div>}
      {data?.props?.showTwo && <div>1---2</div>}
      {data?.props?.showThree && <div>1---3</div>}
    </div>
  );
};

const ElementTwo = (props: Props) => {
  return <div {...props}>ElementTwo content</div>;
};

const ElementThree = (props: Props) => {
  return <div {...props}>ElementThree content</div>;
};

const OneElement = {
  menuElement: <Menu label={"ElementOne"} />,
  showElement: <ElementOne />,
  props: {
    showOne: true,
    showTwo: true,
    showThree: true,
  },
  setProps: {
    showOne: { name: "第一部分", type: "boolean" },
    showTwo: { name: "第二部分", type: "boolean" },
    showThree: { name: "第三部分", type: "boolean" },
  },
  name: "ElementOne",
};
const TwoElement = {
  menuElement: <Menu label={"ElementTwo"} />,
  showElement: <ElementTwo />,
  setProps: {},
  name: "ElementTwo",
};
const ThreeElement = {
  menuElement: <Menu label={"ElementThree"} />,
  showElement: <ElementThree />,
  setProps: {},
  name: "ElementThree",
};

const elements: IElementItem[] = [OneElement, TwoElement, ThreeElement];

const OElements: OperateElementItemProp[] = [OneElement, TwoElement, ThreeElement];

export const DragOperatorDemo = () => {
  return (
    <div style={{ height: "100%" }}>
      <Operator elements={elements} initialOElements={OElements} />
    </div>
  );
};
