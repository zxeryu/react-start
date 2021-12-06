import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { IElement } from "./types";
import { IConfigData, ElementConfigBase } from "@react-start/cheng-high";

export interface ChengContextProps {
  elements: IElement[];
  configData?: IConfigData;
  onConfigChange?: (configData: IConfigData) => void;
  currentElement?: ElementConfigBase;
  setCurrentElement: (element: ElementConfigBase) => void;
}

const ChengContext = createContext<ChengContextProps>({} as any);

export const useCheng = () => useContext(ChengContext);

export interface ChengProviderProps extends Omit<ChengContextProps, "currentElement" | "setCurrentElement"> {
  children: ReactNode;
}

export const ChengProvider = ({ children, elements, configData, onConfigChange }: ChengProviderProps) => {
  const [currentElement, setCurrentElement] = useState<ElementConfigBase | undefined>();

  useEffect(() => {
    setCurrentElement(undefined);
  }, [configData]);

  return (
    <ChengContext.Provider value={{ elements, configData, onConfigChange, currentElement, setCurrentElement }}>
      {children}
    </ChengContext.Provider>
  );
};
