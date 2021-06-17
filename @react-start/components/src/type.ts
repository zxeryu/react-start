import { ReactNode } from "react";

export type TValue = string | number;

export interface IOption {
  label: ReactNode;
  value: TValue;
  disable?: boolean;
}

export interface ITreeOption extends IOption {
  children?: ITreeOption[];
  isLeaf?: boolean;
}

export type TOptions = IOption[];
