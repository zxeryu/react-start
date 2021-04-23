import { ReactNode } from "react";

export type TValue = string | number;

export interface IOption {
  label: ReactNode;
  value: TValue;
}

export type TOptions = IOption[];
