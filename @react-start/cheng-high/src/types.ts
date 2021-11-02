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
  /**
   * 需要注册才发送事件
   * 有些事件默认是不发送的，比如：HighForm中 onFieldsChange；
   * origin元素大部分默认是不发送onClick事件的（a等标签除外），需注册onClick
   */
  registerEvent?: string[];
  //接受状态的描述
  receiveStateList?: {
    //state中的key值
    name: NamePath;
    //组件需要的属性名称；如不存在，用name的值作为属性名称传递给组件
    mapName?: NamePath;
  }[];
  //同receiveStateList，只是从props中取值
  receivePropsList?: {
    name: NamePath;
    mapName?: NamePath;
  }[];
  //可以转化成组件的标识，这类属性会优先转换成组件
  transformElementList?: {
    name: NamePath;
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

export interface HighProps extends HighConfig, HighSendEvent {
  hidden?: boolean;
}

export interface BaseHighProps extends HighProps {
  [key: string]: any;
}
