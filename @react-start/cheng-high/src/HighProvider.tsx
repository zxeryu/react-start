import React, { createContext, ForwardRefRenderFunction, FunctionComponent, ReactNode, useContext } from "react";

interface HighContextProps {
  elementsMap?: { [key: string]: FunctionComponent | ForwardRefRenderFunction<any, any> };
}

const HighContext = createContext<HighContextProps>({} as any);

export const useHigh = () => useContext(HighContext);

export const HighProvider = ({ children, elementsMap }: HighContextProps & { children: ReactNode }) => {
  return <HighContext.Provider value={{ elementsMap }}>{children}</HighContext.Provider>;
};
