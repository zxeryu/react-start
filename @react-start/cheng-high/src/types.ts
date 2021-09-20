export type HighAction = {
  //事件名称
  type: string;
  //数据or对象
  payload?: any;
  //是否是全局事件 或 type名称是"global-"开始
  global?: boolean;
};

export type HConfig = {
  //默认发送事件名称
  sendEventName?: string;
  //高阶组件中使用 如HighTable中使用HighButton
  onSend?: (action: HighAction) => void;
  receiveStateList?: {
    //state中的key值
    name: string;
    //组件需要的属性名称；如不存在，用name的值作为属性名称传递给组件
    mapName?: string;
  }[];
};

export interface HighConfig {
  highConfig?: HConfig;
}
