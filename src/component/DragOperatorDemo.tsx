import React, { useEffect, useRef, useState } from "react";
import {
  IElementItem,
  Operator,
  SelectSet,
  IOperateElementItem,
  OperateElementItemProp,
  useSetProp,
} from "@react-start/cheng";
import { Button, Stack } from "@material-ui/core";
import { omit, get, reduce, pick } from "lodash";
import { OperatePanelProps } from "../../@react-start/cheng/src";

const Menu = ({ label, ...otherProps }: { label: string }) => (
  <div {...omit(otherProps, "style")} style={{ padding: "5px 8px", ...get(otherProps, "style") }}>
    {label}
  </div>
);

const OneElement: IElementItem = {
  menuElement: <Menu label={"ElementOne"} />,
  props: {
    showOne: true,
    showTwo: true,
    showThree: true,
    size: 10,
    text: "",
    customValue: 0,
  },
  setProps: {
    showOne: { name: "第一部分", type: "boolean" },
    showTwo: { name: "第二部分", type: "boolean" },
    showThree: { name: "第三部分", type: "boolean" },
    size: { name: "数字", type: "number", inputType: "input" },
    text: { name: "文本", type: "string", inputType: "input", rows: 5 },
    customValue: { name: "自定义部分", type: "custom" },
  },
  name: "ElementOne",
  canDrag: true,
  id: "ElementOne",
};

//自定义设置Item

const TestValueSet = (props: any) => {
  return (
    <div>
      <SelectSet name={"选择值"} propKey={"selectValue"} {...props} chooseValue={[1, 2, 3]} />
    </div>
  );
};

const TwoElement: IElementItem = {
  menuElement: <Menu label={"ElementTwo"} />,
  props: { selectValue: 1 },
  setProps: {
    selectValue: {
      element: <TestValueSet />,
    },
  },
  name: "ElementTwo",
  canDrag: true,
  id: "ElementTwo",
};

//自定义设置页面

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
  setElement: <TestPageSet />,
  name: "ElementThree",
  canDrag: true,
  canDelete: true,
  id: "ElementThree",
};

const FourElement: IElementItem = {
  menuElement: <Menu label={"ElementFour"} />,
  name: "ElementFour",
  canDrag: true,
  id: "ElementThree",
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
  isExtra: true,
};

const ComposeOperateItem = {
  id: "compose",
  oid: "compose",
  directShow: false,
  menuElement: <Menu label={"组合"} />,
  name: "组合",
  isExtra: true,
  elementList: [ColorOperateItem],
};

const elements: IElementItem[] = [OneElement, TwoElement, ThreeElement];

const OElements: OperateElementItemProp[] = [OneElement, TwoElement, ThreeElement, FourElement];

/************************** 自定义设置组件 ***********************/

const CustomSet = (props: any) => {
  const { setProp } = useSetProp();

  const [value, setValue] = useState<number>(props.value || 1);

  return (
    <div>
      Custom Set {value}
      <button
        onClick={() => {
          if (props.propKey) {
            const next = value + 1;
            setValue(next);
            setProp(props.propKey, next);
          }
        }}>
        add
      </button>
    </div>
  );
};

const ExtraSetElementMap: OperatePanelProps["extraSetElementMap"] = {
  custom: CustomSet,
};

export const DragOperatorDemo = () => {
  const [showWidth, setShowWidth] = useState<string | number>("100%");

  const frameRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    const initData = reduce(
      OElements,
      (pair, item) => {
        return {
          ...pair,
          [item.id!]: pick(item, "props"),
        };
      },
      {},
    );
    setTimeout(() => {
      frameRef.current?.contentWindow?.postMessage({ type: "compose", data: initData }, "*");
    }, 1000);
  }, []);

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

      <Stack direction={"row"} css={{ height: "80vh" }}>
        <Operator
          elements={elements}
          operateElements={OElements}
          extraOperateElements={[ComposeOperateItem as any]}
          extraSetElementMap={ExtraSetElementMap}
          onChange={(data) => {
            const composeData = reduce(
              data,
              (pair, item) => {
                return {
                  ...pair,
                  [item.id!]: pick(item, "props"),
                };
              },
              {},
            );

            console.log("@@@@@@@@@@", composeData);

            frameRef.current?.contentWindow?.postMessage({ type: "compose", data: composeData }, "*");
          }}
          onExtraChange={(id, key, value) => {
            console.log("@@@@@@@@@", id, key, value);
          }}
          header={<div>Header</div>}
          footer={<div>Footer</div>}
        />
        <iframe ref={frameRef} src={"/DragShowPage"} width={showWidth} />
      </Stack>
    </div>
  );
};
