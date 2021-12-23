import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { IElement } from "./types";
import { IConfigData, ElementConfigBase } from "@react-start/cheng-high";
import { reduce } from "lodash";

type EditType = "form" | "jsonShow" | "jsonEdit";

export interface ChengContextProps {
  elements: IElement[];
  elementsMap: { [key: string]: IElement };
  configData?: IConfigData;
  onConfigChange?: (configData: IConfigData) => void;
  currentElement?: ElementConfigBase;
  setCurrentElement: (element?: ElementConfigBase, path?: string, editType?: EditType) => void;
  currentPath?: string;
  editType?: EditType;
  setEditType: (type?: EditType) => void;
}

const ChengContext = createContext<ChengContextProps>({} as any);

export const useCheng = () => useContext(ChengContext);

export interface ChengProviderProps extends Pick<ChengContextProps, "elements" | "configData" | "onConfigChange"> {
  children: ReactNode;
}

export const ChengProvider = ({ children, elements, configData, onConfigChange }: ChengProviderProps) => {
  const [currentElement, setCurrentElementState] = useState<ElementConfigBase | undefined>();
  const [currentPath, setCurrentPath] = useState<string>();

  const [editType, setEditType] = useState<EditType>();

  const setCurrentElement = useCallback(
    (element: ElementConfigBase | undefined, path?: string, editType?: EditType) => {
      setCurrentElementState(element);
      setCurrentPath(path);
      setEditType(editType);
    },
    [],
  );

  useEffect(() => {
    setCurrentElement(undefined);
  }, [configData]);

  const elementsMap = useMemo(() => {
    return reduce(elements, (pair, item) => ({ ...pair, [item.name]: item }), {});
  }, [elements]);

  return (
    <ChengContext.Provider
      value={{
        elements,
        elementsMap,
        configData,
        onConfigChange,
        currentElement,
        setCurrentElement,
        currentPath,
        editType,
        setEditType,
      }}>
      {children}
    </ChengContext.Provider>
  );
};
