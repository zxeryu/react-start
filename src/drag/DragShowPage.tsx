import React, { HTMLAttributes, useEffect, useState } from "react";
import { get } from "lodash";
import { OperateElementItemProp } from "../../@react-start/cheng";

type Props = HTMLAttributes<HTMLDivElement> & { data?: OperateElementItemProp };

export const ElementOne = ({ data, ...props }: Props) => {
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

export const ElementTwo = ({ data, ...props }: Props) => {
  return (
    <div {...props}>
      ElementTwo content
      <div>选择值：{data?.props?.selectValue}</div>
    </div>
  );
};

export const ElementThree = ({ data, ...props }: Props) => {
  return (
    <div {...props}>
      ElementThree content
      <div>自定义设置值：{data?.props?.customValue}</div>
    </div>
  );
};

export const DragShowPage = () => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    window.addEventListener("message", (e) => {
      const type = get(e.data, "type");
      if (type === "update") {
        setCount((prevState) => prevState + 1);
      }
    });
  }, []);

  return (
    <div>
      DragShowPage
      {count}
      <button onClick={() => setCount((prevState) => prevState + 1)}>update</button>
    </div>
  );
};
