import { ReactNode } from "react";

export interface SetProp {
  required?: boolean; //默认非必填
  type?: "string" | "number" | "boolean" | "array" | "title" | "element" | "elementList" | "object" | string; //boolean：默认选项； array：多选；
  inputType?: "select" | "input" | "json"; //默认select
  rows?: number; //if type===input rows行数
  chooseValue?: (string | number)[] | { label: string; value: string | number }[]; //type 为boolean 或 inputType为input时候不需要
  name?: string;
  element?: ReactNode;
  subSetProp?: ISetProps; //object
}

export interface ISetProps {
  [key: string]: SetProp;
}

export interface IElementItem {
  //是否是操作组件
  isElementItem?: boolean;
  //展示的组件
  menuElement?: ReactNode;
  //set element
  setElement?: ReactNode;
  //可设置的属性
  setProps?: ISetProps;
  //props 根据setProps生成的属性
  props?: { [key: string]: any };
  //使用过程中的唯一标识（元素id）
  id: string;
  //名称
  name?: string;
  //是否能拖动 默认true
  canDrag?: boolean;
  //是否能修改名称
  canEditName?: boolean;
  //不进入操作区，如：全局设置
  isExtra?: boolean;
  //是否可以删除
  canDelete?: boolean;
  //是否是容器，可以添加子元素标识
  isContainer?: boolean;
}

export interface IElement {
  name: string;
  //是否是容器，可以添加子元素标识，添加元素的时候设置elementList
  isContainer?: boolean;
  //分组显示
  group?: string;
}
