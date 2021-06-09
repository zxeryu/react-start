import React, { HTMLAttributes, useRef, useState } from "react";
import {
  IElementItem,
  Operator,
  SelectSet,
  IOperateElementItem,
  OperateElementItemProp,
  useSetProp,
} from "@react-start/cheng";
import { Button } from "@material-ui/core";

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
      <div>数字：{data?.props?.size}</div>
      <div>文本：{data?.props?.text}</div>
    </div>
  );
};

const ElementTwo = ({ data, ...props }: Props) => {
  return (
    <div {...props}>
      ElementTwo content
      <div>选择值：{data?.props?.selectValue}</div>
    </div>
  );
};

const ElementThree = ({ data, ...props }: Props) => {
  return (
    <div {...props}>
      ElementThree content
      <div>自定义设置值：{data?.props?.customValue}</div>
    </div>
  );
};

const OneElement: IElementItem = {
  menuElement: <Menu label={"ElementOne"} />,
  showElement: <ElementOne />,
  props: {
    showOne: true,
    showTwo: true,
    showThree: true,
    size: 0,
    text: "",
  },
  setProps: {
    showOne: { name: "第一部分", type: "boolean" },
    showTwo: { name: "第二部分", type: "boolean" },
    showThree: { name: "第三部分", type: "boolean" },
    size: { name: "数字", type: "number", inputType: "input" },
    text: { name: "文本", type: "string", inputType: "input", rows: 5 },
  },
  name: "ElementOne",
};

const TestValueSet = (props: any) => {
  return (
    <div>
      <SelectSet name={"选择值"} propKey={"selectValue"} {...props} chooseValue={[1, 2, 3]} />
    </div>
  );
};

const TwoElement: IElementItem = {
  menuElement: <Menu label={"ElementTwo"} />,
  showElement: <ElementTwo />,
  props: { selectValue: 1 },
  setProps: {
    selectValue: {
      element: <TestValueSet />,
    },
  },
  name: "ElementTwo",
};

const TestPageSet = ({ data }: { data?: IOperateElementItem }) => {
  const { setProp } = useSetProp();
  return (
    <div>
      自定义设置view
      <div>
        <div>当前值：{data?.props?.customValue}</div>
        <Button onClick={() => setProp("customValue", 1)}>设置值 1</Button>
        <Button onClick={() => setProp("customValue", 2)}>设置值 2</Button>
        <Button onClick={() => setProp("customValue", 3)}>设置值 3</Button>
      </div>
    </div>
  );
};

const ThreeElement: IElementItem = {
  menuElement: <Menu label={"ElementThree"} />,
  showElement: <ElementThree />,
  setElement: <TestPageSet />,
  name: "ElementThree",
};

const colorInputProps = {
  type: "string",
  inputType: "input",
};

const ColorOperateItem = {
  id: "color",
  oid: "color",
  directShow: false,
  menuElement: <Menu label={"颜色"} />,
  name: "颜色",
  setProps: {
    //general
    generalTitle: { type: "title", name: "General" },
    heading: { name: "Heading", ...colorInputProps },
    bodyText: { name: "Body Text", ...colorInputProps },
    bodyTextLight: { name: "Body Text Light", ...colorInputProps },
    link: { name: "Link", ...colorInputProps },
    background: { name: "Background", ...colorInputProps },
    backgroundLight: { name: "Background Light", ...colorInputProps },
    price: { name: "Price", ...colorInputProps },
    buttonTitle: { type: "title", name: "Button" },
    buttonBackground: { name: "Background", ...colorInputProps },
    buttonText: { name: "Text", ...colorInputProps },
    headerTitle: { type: "title", name: "Header" },
    headerBackground: { name: "Background", ...colorInputProps },
    headerHeading: { name: "Heading and icons", ...colorInputProps },
    headerLight: { name: "Text Light", ...colorInputProps },
    footerTitle: { type: "title", name: "Footer" },
    footerBackground: { name: "Background", ...colorInputProps },
    footerHeading: { name: "Heading", ...colorInputProps },
    footerLight: { name: "Text Light", ...colorInputProps },
  },
};

const ComposeOperateItem = {
  id: "compose",
  oid: "compose",
  directShow: false,
  menuElement: <Menu label={"组合"} />,
  name: "组合",
  elementList: [ColorOperateItem],
};

const elements: IElementItem[] = [OneElement, TwoElement, ThreeElement];

const OElements: OperateElementItemProp[] = [OneElement, TwoElement, ThreeElement];

export const DragOperatorDemo = () => {
  const [showWidth, setShowWidth] = useState<string | number>("100%");

  const frameRef = useRef<HTMLIFrameElement | null>(null);

  return (
    <div>
      <Button onClick={() => setShowWidth("100%")}>pc</Button>
      <Button onClick={() => setShowWidth(375)}>mobile</Button>
      <Button
        onClick={() => {
          frameRef.current?.contentWindow?.postMessage({ type: "update" }, "*");
        }}>
        update
      </Button>

      <Operator
        elements={elements}
        initialOElements={OElements}
        showAreaProps={{ width: showWidth }}
        operateExtra={[ComposeOperateItem as any]}>
        <iframe ref={frameRef} src={"/DragShowPage"} width={showWidth} />
      </Operator>
    </div>
  );
};
