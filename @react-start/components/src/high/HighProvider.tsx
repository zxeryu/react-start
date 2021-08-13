import React, {
  createContext,
  ForwardRefRenderFunction,
  FunctionComponent,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";

interface HighContextProps {
  elementsMap?: { [key: string]: FunctionComponent | ForwardRefRenderFunction<any, any> };
}

const HighContext = createContext<HighContextProps>({} as any);

export const useHigh = () => useContext(HighContext);

export const HighProvider = ({ children, elementsMap }: HighContextProps & { children: ReactNode }) => {
  return <HighContext.Provider value={{ elementsMap }}>{children}</HighContext.Provider>;
};

interface HighPageContextProps {
  state: { [key: string]: any };
  setState: (pair: { [key: string]: any }) => void;
}

const HighPageContext = createContext<HighPageContextProps>({} as any);

// deal dynamic data
export const HighPageProvider = ({ children }: { children: ReactNode }) => {
  const [value, setValue] = useState<{ [key: string]: any }>({});
  const setState = useCallback((pair: { [key: string]: any }) => {
    setValue((pre) => ({ ...pre, ...pair }));
  }, []);
  return <HighPageContext.Provider value={{ state: value, setState }}>{children}</HighPageContext.Provider>;
};
