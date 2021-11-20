import { HighAction } from "../types";
import { useHighPage } from "../HighPageProvider";
import { useEffect } from "react";

export const useDomEvent = (callback: (action: HighAction) => void) => {
  const { subject$ } = useHighPage();

  useEffect(() => {
    const sub = subject$.subscribe((action) => {
      callback(action);
    });
    return () => {
      sub.unsubscribe();
    };
  }, []);
};

export * from "./components";
export * from "../HighPageProvider";
export * from "./Wrapper";
