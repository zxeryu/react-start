//支持的组件类型
type TValue = "text" | "textarea" | "digit" | "money" | "select" | "checkbox" | "radio" | "switch" | "rate" | "slider";

/**
 * form item 类型的属性
 */
export interface SetItemProp {
  valueType: TValue | TValue[];
  name: string;
  label?: string;
  [key: string]: any;
}

export interface SetGroupProp {
  name: string;
  label?: string;
  groupType: "object" | "array";
  children: (SetItemProp | SetGroupProp)[];
}

export interface IElement {
  name: string;

  //设置属性
  setProps?: (SetItemProp | SetGroupProp)[];

  //是否是容器，可以添加子元素标识，添加元素的时候设置elementList
  isContainer?: boolean;

  //分组显示
  group?: string;
}
