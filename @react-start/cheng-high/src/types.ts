import { ReactNode } from "react";

export type TValue = string | number;

export interface IOption {
  label: ReactNode;
  value: TValue;
  disable?: boolean;
}

export interface ITreeOption extends IOption {
  children?: ITreeOption[];
  isLeaf?: boolean;
}

export type TOptions = IOption[];

export declare type InternalNamePath = (string | number)[];
export declare type NamePath = string | number | InternalNamePath;

export type HighAction = {
  //事件名称
  type: string;
  //数据or对象
  payload?: any;
  //是否是全局事件 或 type名称是"global-"开始
  global?: boolean;
};

export interface ElementConfigBase {
  elementType$: string;
  elementProps$: any;
  oid: string;
  elementList?: ElementConfigBase;
}

export interface HConfig {
  //默认发送事件名称
  sendEventName?: string;
  //有些事件默认是不发送的，比如：HighForm中 onFieldsChange
  //需要注册才发送事件
  registerEvent?: string[];
  //接受状态的描述
  receiveStateList?: {
    //state中的key值
    name: NamePath;
    //组件需要的属性名称；如不存在，用name的值作为属性名称传递给组件
    mapName?: NamePath;
    //目标props是否是对象，如：HighTable 中的pagination
    isObject?: boolean;
  }[];

  highInject?: Pick<ElementConfigBase, "elementType$" | "oid" | "elementList">;
}

export interface HighConfig {
  highConfig?: HConfig;
}

export interface HighSendEvent {
  //高阶组件中使用 如HighTable中使用HighButton
  onSend?: (action: HighAction) => void;
}

export interface HighProps extends HighConfig, HighSendEvent {}

export interface BaseHighProps extends HighProps {
  [key: string]: any;
}
