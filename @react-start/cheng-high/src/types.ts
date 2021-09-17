export interface HighEvent {
  //默认发送事件
  sendEventName?: string;
  receiveStateList?: {
    //state中的key值
    name: string;
    //组件需要的属性名称；如不存在，用name的值作为属性名称传递给组件
    mapName?: string;
  }[];
}
