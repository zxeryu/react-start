import React, { HTMLAttributes, useEffect, useState } from "react";
import { get } from "lodash";
import { Stack } from "@material-ui/core";
import { IOperateElementItem } from "@react-start/cheng";

type Props = HTMLAttributes<HTMLDivElement> & { data?: IOperateElementItem };

const ElementOne = ({ data, ...props }: Props) => {
  return (
    <div {...props}>
      ElementOne content
      {data?.props?.showOne && <div>1---1</div>}
      {data?.props?.showTwo && <div>1---2</div>}
      {data?.props?.showThree && <div>1---3</div>}
      <div>数字：{data?.props?.size}</div>
      <div>文本：{data?.props?.text}</div>
      <div>自定义设置值：{data?.props?.customValue}</div>
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

export const DragShowPage = () => {
  const [count, setCount] = useState<number>(0);

  const [composeData, setComposeData] = useState<any>({});

  useEffect(() => {
    window.addEventListener("message", (e) => {
      const type = get(e.data, "type");
      if (type === "update") {
        setCount((prevState) => prevState + 1);
      }
      if (type === "compose") {
        setComposeData(get(e.data, "data"));
      }
    });
  }, []);

  return (
    <div>
      DragShowPage
      {count}
      <button onClick={() => setCount((prevState) => prevState + 1)}>update</button>
      <Stack spacing={2}>
        <ElementOne data={get(composeData, "ElementOne-O")} />
        <ElementTwo data={get(composeData, "ElementTwo-O")} />
        <ElementThree data={get(composeData, "ElementThree-O")} />
      </Stack>
    </div>
  );
};
