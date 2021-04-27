import { DragEventHandler, useCallback, useMemo, useRef, useState } from "react";

const DataKey = "custom-data";

interface DropAreaState {
  isHovering: boolean;
}

interface DropProps {
  onDragOver: DragEventHandler;
  onDragEnter: DragEventHandler;
  onDragLeave: DragEventHandler;
  onDrop: DragEventHandler;
}

export interface DropAreaOptions<TData> {
  onDom?: (data: TData, event?: DragEvent) => void;
  onDragOver?: DragEventHandler;
  onDragEnter?: DragEventHandler;
  onDragLeave?: DragEventHandler;
}

export const useDrop = <TData>(options: DropAreaOptions<TData> = {}): [DropProps, DropAreaState] => {
  const optionsRef = useRef(options);
  optionsRef.current = options;
  const [isHovering, setIsHovering] = useState<boolean>(false);

  const callback = useCallback((dataTransfer: DataTransfer, event: DragEvent) => {
    const dom = dataTransfer.getData(DataKey);
    if (dom && optionsRef.current.onDom) {
      let data;
      try {
        data = JSON.parse(dom);
      } catch (e) {
        data = dom;
      }
      optionsRef.current.onDom(data, event);
    }
  }, []);

  const dropProps: DropProps = useMemo(() => {
    return {
      onDragOver: (e) => {
        e.preventDefault();
        optionsRef.current.onDragOver && optionsRef.current.onDragOver(e);
      },
      onDragEnter: (e) => {
        e.preventDefault();
        setIsHovering(true);
        optionsRef.current.onDragEnter && optionsRef.current.onDragEnter(e);
      },
      onDragLeave: (e) => {
        e.preventDefault();
        setIsHovering(false);
        optionsRef.current.onDragLeave && optionsRef.current.onDragLeave(e);
      },
      onDrop: (e) => {
        e.preventDefault();
        e.persist();
        setIsHovering(false);
        callback(e.dataTransfer, e as any);
      },
    };
  }, []);

  return [dropProps, { isHovering }];
};
