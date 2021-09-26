import React, { useEffect, useRef, useState } from "react";
import {
  IElementItem,
  Operator,
  SelectSet,
  IOperateElementItem,
  useSetProp,
  OperatePanelProps,
} from "@react-start/cheng";
import { Button } from "@material-ui/core";
import { omit, get, reduce, pick } from "lodash";

const Menu = ({ label, ...otherProps }: { label: string }) => (
  <div {...omit(otherProps, "style")} style={{ padding: "5px 8px", ...get(otherProps, "style") }}>
    {label}
  </div>
);

const OneElement: IOperateElementItem = {
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
  oid: "ElementOne-O",
};

//自定义设置Item

const TestValueSet = (props: any) => {
  return (
    <div>
      <SelectSet
        name={"选择值"}
        propKey={"selectValue"}
        {...props}
        // chooseValue={[1, 2, 3]}
        chooseValue={[
          { label: "label-1", value: 1 },
          { label: "label-2", value: 2 },
          { label: "label-3", value: 3 },
        ]}
      />
    </div>
  );
};

const TwoElement: IOperateElementItem = {
  menuElement: <Menu label={"ElementTwo"} />,
  props: { selectValue: 1 },
  setProps: {
    selectValue: {
      element: <TestValueSet />,
    },
  },
  name: "ElementTwo",
  canEditName: true,
  // canDrag: true,
  id: "ElementTwo",
  oid: "ElementTwo-O",
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
        <div css={{ height: "90vh", backgroundColor: "grey" }} />
      </div>
    </div>
  );
};

const ThreeElement: IOperateElementItem = {
  menuElement: <Menu label={"ElementThree"} />,
  setElement: <TestPageSet />,
  name: "ElementThree",
  canDrag: true,
  canDelete: true,
  canEditName: true,
  id: "ElementThree",
  oid: "ElementThree-O",
};

const FourElement: IOperateElementItem = {
  menuElement: <Menu label={"ElementFour"} />,
  name: "ElementFour",
  canDrag: true,
  id: "ElementFour",
  oid: "ElementFour-O",
};

/************************** extra ***********************/

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

/************************** card ***********************/

const CardElement: IElementItem = {
  menuElement: <Menu label={"Card"} />,
  props: {
    title: "",
    subTile: "",
    content: "",
    img: "",
  },
  setProps: {
    title: { name: "标题", type: "string", inputType: "input" },
    subTile: { name: "副标题", type: "string", inputType: "input" },
    content: { name: "内容", type: "string", inputType: "input", rows: 5 },
  },
  name: "Card",
  canDrag: true,
  id: "Card",
};

const elements: IElementItem[] = [OneElement, TwoElement, ThreeElement, CardElement];

const OElements: IOperateElementItem[] = [OneElement, TwoElement, ThreeElement, FourElement];

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
  const [mode, setMode] = useState<"pc" | "mobile">("pc");

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
      <Button onClick={() => setMode("pc")}>pc</Button>
      <Button onClick={() => setMode("mobile")}>mobile</Button>
      <Button
        onClick={() => {
          frameRef.current?.contentWindow?.postMessage({ type: "update" }, "*");
        }}>
        update
      </Button>

      <Operator
        css={{
          ".LeftArea": {
            border: "1px solid #eee",
            padding: "10px 10px 10px",
          },
          ".NormalItem": {
            padding: "6px 0",
          },
          ".OperatePanel": {
            padding: "0 10px",
          },
          ".RightArea .OperatePanel": {
            border: "1px solid #eee",
          },
          ".RightArea .OperatePanel .OperatePanelItemStack": {
            "*": { marginTop: 6 },
          },
          ".LeftArea .OperatePanel .OperatePanelItemStack": {
            "*": { marginTop: 4 },
          },
          ".LeftArea .LeftAreaBottom": {
            minHeight: 300,
          },
          ".LeftArea .LeftAreaBottom .NormalItem": {
            color: "red",
          },
        }}
        style={{ height: "80vh" }}
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
                [item.oid!]: pick(item, "props"),
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
        onItemClick={(oel) => {
          console.log("#######", oel);
        }}
        // header={<div>Header</div>}
        // footer={<div>Footer</div>}
      >
        <iframe
          style={{ border: 0 }}
          ref={frameRef}
          src={"/DragShowPage"}
          css={{ ...(mode === "pc" ? { flex: 1 } : { width: 375 }), height: "80vh" }}
        />
      </Operator>
    </div>
  );
};
