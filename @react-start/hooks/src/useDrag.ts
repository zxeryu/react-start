import { useCallback } from "react";

const DataKey = "custom-data";

type PropFun<TData> = (
  data?: TData,
) => {
  draggable: "true";
  onDragStart: (e: DragEvent | any) => void;
  onDragEnd: (e: DragEvent | any) => void;
};

interface IConfig<T> {
  onDragStart?: (e: DragEvent, data?: T) => void;
  onDragEnd?: (e: DragEvent, data?: T) => void;
}

export const useDrag = <TData>(config?: IConfig<TData>): PropFun<TData> => {
  return useCallback((data?: TData) => {
    return {
      draggable: "true",
      onDragStart: (e) => {
        if (config && config.onDragStart) {
          config.onDragStart(e, data);
        }
        e && e.dataTransfer && e.dataTransfer.setData(DataKey, JSON.stringify(data));
      },
      onDragEnd: (e) => {
        if (config && config.onDragEnd) {
          config.onDragEnd(e, data);
        }
      },
    };
  }, []);
};
