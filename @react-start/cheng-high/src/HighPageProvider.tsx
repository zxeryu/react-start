import React, { createContext, ReactNode, useContext, useReducer, Reducer } from "react";

type Values = { [key: string]: any };

type Action = { type: string; payload: any };

interface HighPageContextProps {
  state: Values;
  dispatch: (action: Action) => void;
}

const HighPageContext = createContext<HighPageContextProps>({} as any);

export const useHighPage = () => useContext(HighPageContext);

// deal dynamic data
export const HighPageProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer<Reducer<Values, Action>>((prevState, action) => {
    return { ...prevState, [action.type]: action.payload };
  }, {});

  return <HighPageContext.Provider value={{ state, dispatch }}>{children}</HighPageContext.Provider>;
};
