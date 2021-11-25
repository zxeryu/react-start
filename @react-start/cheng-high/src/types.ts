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

export interface ElementConfigBase {
  elementType$: string;
  elementProps$: any;
  oid: string;
  elementList?: ElementConfigBase;
}

export type TDataType = "state" | "dataRef" | "arguments";

//值描述 默认state中获取
export type TParam = { name: NamePath; target?: TDataType };

//调用lodash方法描述
export type TGetValue = { funName: string; funParams: (TParam | any)[] };

export type TExecuteType = "dispatch" | "dispatchStore" | "dispatchRequest" | "dispatchMeta" | "setDataToRef";

export type TExecuteItem = {
  execName: TExecuteType;
  execParams: (TGetValue | TParam | any)[];
};

export type TRegisterEventItem = {
  name: NamePath;
  //参数转换 将数arr换为obj，该属性为设置key 如：{key:'event', name:0}
  transObjList?: {
    key: string;
    name: number | NamePath;
  }[];
  //拓展，执行注册的逻辑 如：发起网络
  executeList?: TExecuteItem[];
};

/**
 * 以下 name、mapName 都为path
 */
export interface HConfig {
  //默认发送事件名称
  sendEventName?: string;
  //接受状态的描述
  receiveStateList?: {
    //state中的key值
    name: NamePath;
    //组件需要的属性名称；如不存在，用name的值作为属性名称传递给组件
    mapName?: NamePath;
    /**
     * 是否为多个值中取一个 如：name1 || name2 || name3
     * 值为true时，name必为数组类型，mapName必须有值，否则该属性不生效
     */
    multiple?: boolean;
  }[];
  //同receiveStateList，只是从props中取值
  receivePropsList?: {
    name: NamePath;
    mapName?: NamePath;
    multiple?: boolean;
  }[];
  //可以转化成组件的标识，这类属性会优先转换成组件
  transformElementList?: {
    name: NamePath;
  }[];
  //订阅事件
  registerEventList?: TRegisterEventItem[];

  highInject?: Pick<ElementConfigBase, "elementType$" | "oid" | "elementList">;
}

export interface HighConfig {
  highConfig?: HConfig;
}

export type HighAction = {
  //事件名称
  type: string;
  //数据or对象
  payload?: any;
  //执行事件
  executeList?: TExecuteItem[];
};

export interface HighSendEvent {
  //高阶组件中使用 如HighTable中使用HighButton
  onSend?: (action: HighAction) => void;
}

export interface HighProps extends HighConfig, HighSendEvent {
  /**
   * hidden和show都是用来控制组件显隐；
   * 都为undefined的话默认显示组件；
   * 代码中优先判断show；若show为undefined再去判断hidden
   */
  hidden?: boolean;
  show?: boolean;
}

export interface BaseHighProps extends HighProps {
  [key: string]: any;
}
