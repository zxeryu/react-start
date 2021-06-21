import React, { CSSProperties, useContext } from "react";
import { createContext, ReactNode } from "react";
import { FormHelperText, Grid, GridTypeMap } from "@material-ui/core";

import { BaseForm, BaseFormItem, IBaseFormContext, IBaseFormProps, useBaseForm, useItemProps } from "./BaseForm";

export type TMode = "horizontal" | "vertical" | "inline";

interface IFormContext extends IBaseFormContext {
  mode?: TMode;
  labelStyle?: CSSProperties;
  inputStyle?: CSSProperties;
}

const FormContext = createContext<IFormContext>({} as any);

export const useForm = () => useContext(FormContext);

const ContextProvider = ({ children, ...other }: Omit<IFormContext, "form"> & { children?: ReactNode }) => {
  const { form } = useBaseForm();
  return <FormContext.Provider value={{ form, ...other }}>{children}</FormContext.Provider>;
};

export interface IFormProps extends IBaseFormProps, Omit<IFormContext, "form"> {
  style?: CSSProperties;
  rootProps?: GridTypeMap["props"];
}

export const Form = ({
  children,
  //
  style,
  rootProps,
  //
  mode,
  labelStyle,
  inputStyle,
  //
  ...formProps
}: IFormProps) => {
  return (
    <BaseForm {...formProps}>
      <ContextProvider mode={mode} inputStyle={inputStyle} labelStyle={labelStyle}>
        <Grid
          style={style}
          container
          direction={mode === "inline" ? "row" : "column"}
          wrap={mode === "inline" ? "wrap" : "nowrap"}
          {...rootProps}>
          {children}
        </Grid>
      </ContextProvider>
    </BaseForm>
  );
};

export interface IFormItemProps extends Pick<IFormContext, "mode" | "labelStyle" | "inputStyle"> {
  children: ReactNode;
  name?: string;
  label?: ReactNode;
  directChange?: boolean;
  //拓展兼容
  valuePropName?: string;
  trigger?: string;
}

export const FormItem = ({
  children,
  name,
  label,
  //
  mode,
  labelStyle,
  inputStyle,
  //
  directChange,
  valuePropName,
  trigger,
}: IFormItemProps) => {
  const formContext = useForm();
  const { error, errorMsg } = useItemProps(name);

  const realMode = mode || formContext.mode;
  // mode !== "vertical" ? "center" : undefined
  return (
    <>
      <Grid
        style={{
          ...(realMode === "inline" ? { width: "auto" } : null),
        }}
        container
        item
        direction={realMode === "vertical" ? "column" : "row"}
        alignItems={realMode !== "vertical" ? "center" : "flex-start"}>
        <Grid
          item
          style={{
            marginRight: 1,
            ...formContext.labelStyle,
            ...labelStyle,
          }}>
          {label}
          {label && "："}
        </Grid>
        <Grid item style={{ ...formContext.inputStyle, ...inputStyle }}>
          {name ? (
            <BaseFormItem
              name={name}
              fullWidth
              directChange={directChange}
              showHelperText={false}
              valuePropName={valuePropName}
              trigger={trigger}>
              {children}
            </BaseFormItem>
          ) : (
            children
          )}
        </Grid>
      </Grid>
      {realMode !== "inline" && (
        <Grid container item>
          {realMode === "horizontal" && (
            <Grid item style={{ marginRight: 1, ...formContext.labelStyle, ...labelStyle }} />
          )}
          <Grid item>
            <FormHelperText error={error}>{error ? errorMsg || " " : " "}</FormHelperText>
          </Grid>
        </Grid>
      )}
    </>
  );
};
