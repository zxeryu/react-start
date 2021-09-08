import { ReactNode } from "react";

export interface SetProp {
  required?: boolean; //默认非必填
  type?: "string" | "number" | "boolean" | "array" | "title" | string; //boolean：默认选项； array：多选；
  inputType?: "select" | "input" | "json"; //默认select
  rows?: number; //if type===input rows行数
  chooseValue?: (string | number)[]; //type 为boolean 或 inputType为input时候不需要
  name?: string;
  element?: ReactNode;
}

interface ISetProps {
  [key: string]: SetProp;
}

export interface IElementItem {
  //展示的组件
  menuElement?: ReactNode;
  //set element
  setElement?: ReactNode;
  //真正渲染的组件
  showElement?: ReactNode;
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
  //不进入操作区，如：全局设置
  isExtra?: boolean;
  //是否可以删除
  canDelete?: boolean;
  //是否是容器，可以添加子元素标识
  isContainer?: boolean;
}

export interface IOperateElementItem extends IElementItem {
  oid: string;
  //
  elementList?: IOperateElementItem[];
}

export interface TreeItem extends IOperateElementItem {
  collapsed?: boolean;
}

export type TreeItems = TreeItem[];

export interface FlattenedItem extends TreeItem {
  parentId: null | string;
  depth: number;
  index: number;
}
