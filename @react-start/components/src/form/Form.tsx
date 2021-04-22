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

const useForm = () => useContext(FormContext);

const ContextProvider = ({ children, ...other }: Omit<IFormContext, "form"> & { children?: ReactNode }) => {
  const { form } = useBaseForm();
  return <FormContext.Provider value={{ form, ...other }}>{children}</FormContext.Provider>;
};

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
}: IBaseFormProps &
  Omit<IFormContext, "form"> & {
    style?: CSSProperties;
    rootProps?: GridTypeMap["props"];
  }) => {
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
}: { children: ReactNode; name?: string; label?: ReactNode; directChange?: boolean } & Pick<
  IFormContext,
  "mode" | "labelStyle" | "inputStyle"
>) => {
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
            marginRight: 10,
            ...formContext.labelStyle,
            ...labelStyle,
          }}>
          {label}
          {label && "："}
        </Grid>
        <Grid item style={{ ...formContext.inputStyle, ...inputStyle }}>
          {name ? (
            <BaseFormItem name={name} fullWidth directChange={directChange} showHelperText={false}>
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
            <Grid item style={{ marginRight: 10, ...formContext.labelStyle, ...labelStyle }} />
          )}
          <Grid item>
            <FormHelperText error={error}>{error ? errorMsg || " " : " "}</FormHelperText>
          </Grid>
        </Grid>
      )}
    </>
  );
};
