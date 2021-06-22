import { FormikConfig, FormikValues, useFormik } from "formik";
import {
  FieldHelperProps,
  FieldInputProps,
  FieldMetaProps,
  FormikErrors,
  FormikState,
  FormikTouched,
} from "formik/dist/types";
import React, {
  cloneElement,
  createContext,
  CSSProperties,
  isValidElement,
  MutableRefObject,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FormControl, FormHelperText } from "@material-ui/core";
import { get, debounce } from "lodash";
import { BaseSchema, ObjectSchema, object } from "yup";

export type Values = FormikValues;

export interface IFormik {
  initialValues: Values;
  initialErrors: FormikErrors<unknown>;
  initialTouched: FormikTouched<unknown>;
  initialStatus: any;
  handleBlur: {
    (e: React.FocusEvent<any>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
  handleChange: {
    (e: React.ChangeEvent<any>): void;
    <T_1 = string | React.ChangeEvent<any>>(field: T_1): T_1 extends React.ChangeEvent<any>
      ? void
      : (e: string | React.ChangeEvent<any>) => void;
  };
  handleReset: (e: any) => void;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
  resetForm: (nextState?: Partial<FormikState<Values>> | undefined) => void;
  setErrors: (errors: FormikErrors<Values>) => void;
  setFormikState: (stateOrCb: FormikState<Values> | ((state: FormikState<Values>) => FormikState<Values>)) => void;
  setFieldTouched: (
    field: string,
    touched?: boolean,
    shouldValidate?: boolean | undefined,
  ) => Promise<FormikErrors<Values>> | Promise<void>;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined,
  ) => Promise<FormikErrors<Values>> | Promise<void>;
  setFieldError: (field: string, value: string | undefined) => void;
  setStatus: (status: any) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setTouched: (
    touched: FormikTouched<Values>,
    shouldValidate?: boolean | undefined,
  ) => Promise<FormikErrors<Values>> | Promise<void>;
  setValues: (
    values: React.SetStateAction<Values>,
    shouldValidate?: boolean | undefined,
  ) => Promise<FormikErrors<Values>> | Promise<void>;
  submitForm: () => Promise<any>;
  validateForm: (values?: Values) => Promise<FormikErrors<Values>>;
  validateField: (name: string) => Promise<void> | Promise<string | undefined>;
  isValid: boolean;
  dirty: boolean;
  unregisterField: (name: string) => void;
  registerField: (name: string, { validate }: any) => void;
  getFieldProps: (nameOrOptions: any) => FieldInputProps<any>;
  getFieldMeta: (name: string) => FieldMetaProps<any>;
  getFieldHelpers: (name: string) => FieldHelperProps<any>;
  validateOnBlur: boolean;
  validateOnChange: boolean;
  validateOnMount: boolean;
  values: Values;
  errors: FormikErrors<Values>;
  touched: FormikTouched<Values>;
  isSubmitting: boolean;
  isValidating: boolean;
  status?: any;
  submitCount: number;
}

export interface IBaseFormProps extends Omit<FormikConfig<Values>, "initialValues" | "onSubmit"> {
  initialValues?: Values;
  onSubmit?: FormikConfig<Values>["onSubmit"];
  formRef?: MutableRefObject<IFormik | undefined>;
}

export interface IBaseFormContext {
  form: IFormik;
  bindSchema?: (name: string, schema: BaseSchema) => void;
  unbindSchema?: (name: string) => void;
}

const BaseFormContext = createContext<IBaseFormContext>({} as any);

export const useBaseForm = () => useContext(BaseFormContext);

type TSchema = ObjectSchema<any, any, any>;

export const BaseForm = ({ formRef, children, initialValues, onSubmit, ...formikProps }: IBaseFormProps) => {
  const schemaRef = useRef<TSchema>(formikProps?.validationSchema || object({}));
  const [schema, setSchema] = useState<TSchema>(schemaRef.current);

  const unmountRef = useRef<boolean>(false);
  useEffect(() => {
    return () => {
      unmountRef.current = true;
    };
  }, []);

  const debounceSetSchema = useCallback(
    debounce(() => {
      setSchema(schemaRef.current);
    }, 300),
    [],
  );
  const handleBindSchema = useCallback((name: string, s: BaseSchema) => {
    if (unmountRef.current) {
      return;
    }
    schemaRef.current = schemaRef.current.concat(
      object({
        [name]: s,
      }),
    );
    debounceSetSchema();
  }, []);
  const handleUnbindSchema = useCallback((name: string) => {
    if (unmountRef.current) {
      return;
    }

    schemaRef.current = schemaRef.current.omit([name]);
    debounceSetSchema();
  }, []);

  const formik = useFormik({
    initialValues: initialValues || {},
    onSubmit: (values, formikHelpers) => {
      if (onSubmit) {
        return onSubmit(values, formikHelpers);
      }
    },
    ...formikProps,
    validationSchema: schema,
  });

  if (formRef) {
    formRef.current = formik;
  }

  return (
    <BaseFormContext.Provider value={{ form: formik, bindSchema: handleBindSchema, unbindSchema: handleUnbindSchema }}>
      <form noValidate onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
        {children}
      </form>
    </BaseFormContext.Provider>
  );
};

export const useItemProps = (name?: string) => {
  const { form } = useBaseForm();

  const error = useMemo(() => {
    if (!name) return true;
    if (form.submitCount > 0) {
      return Boolean(get(form.errors, name));
    }
    return get(form.touched, name) && Boolean(get(form.errors, name));
  }, [form.touched, form.errors, form.submitCount]);

  return {
    error,
    errorMsg: name ? get(form.errors, name) : "",
  };
};

//拓展兼容
export interface CommonProps {
  directChange?: boolean;
  valuePropName?: string;
  trigger?: string;
  schema?: BaseSchema;
}

export interface IBaseFormItemProps extends CommonProps {
  children: ReactNode;
  //
  name?: string;
  showHelperText?: boolean;
  //style
  fullWidth?: boolean;
  style?: CSSProperties;
  helperTextStyle?: CSSProperties;
}

export const BaseFormItem = ({
  children,
  //
  name,
  showHelperText = true,
  //
  fullWidth,
  style,
  helperTextStyle,
  //
  directChange,
  valuePropName = "value",
  trigger = "onChange",
  schema,
}: IBaseFormItemProps) => {
  const { form, bindSchema, unbindSchema } = useBaseForm();

  const { error, errorMsg } = useItemProps(name);

  const debounceSetTouched = useCallback(
    debounce((name: string) => {
      name && form.setFieldTouched(name, true);
    }, 300),
    [],
  );

  const handleChange = useCallback((...e: any) => {
    debounceSetTouched(name!);
    if (directChange) {
      //直接修改form中的value
      form.setFieldValue(name!, e[0], true);
    } else {
      //取e.target.value
      form.handleChange(e[0]);
    }

    const originChange = get(children, ["props", trigger]);
    if (originChange) {
      originChange(...e);
    }
  }, []);

  useEffect(() => {
    if (name && schema && bindSchema) {
      bindSchema(name, schema);
    }
    return () => {
      if (name && schema && unbindSchema) {
        unbindSchema(name);
      }
    };
  }, []);

  if (!name || !isValidElement(children)) {
    return <>{children}</>;
  }

  return (
    <FormControl error={error} fullWidth={fullWidth} style={style}>
      {cloneElement(children, {
        id: name,
        name,
        error,
        [valuePropName]: get(form.values, name),
        [trigger]: handleChange,
      })}
      {showHelperText && <FormHelperText style={helperTextStyle}>{error ? errorMsg || " " : " "}</FormHelperText>}
    </FormControl>
  );
};
