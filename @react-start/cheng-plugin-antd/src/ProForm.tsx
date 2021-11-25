import React, { createContext, CSSProperties, ReactNode, useCallback, useContext, useEffect, useRef } from "react";
import ProForm, { ProFormInstance, ProFormProps, ProFormList, ProFormListProps } from "@ant-design/pro-form";
import { Spin, SpinProps, Modal, ModalProps, Drawer, DrawerProps, Button, Space, ButtonProps } from "antd";
import { HighProps, useHighPage, ComponentWrapper } from "@react-start/cheng-high";
import { get, debounce, keys, size, indexOf, isUndefined, pick, omit } from "lodash";

export interface FormWrapperProps {
  readonly?: boolean;
  formName?: string;
  loading?: boolean;
  spinProps?: SpinProps;
}

const FormWrapperPropNameList = ["readonly", "formName", "loading", "spinProps"];

export interface FormContextProps extends Pick<FormWrapperProps, "readonly"> {}

const FormContext = createContext<FormContextProps>({} as any);

export const useFormContext = () => useContext(FormContext);

interface FormProps extends Omit<ProFormProps, "onFinish">, FormWrapperProps {
  onFinish?: (values: Record<string, any>, initialValues?: Record<string, any>) => void;
}

const Form = ({
  formName,
  readonly,
  loading,
  spinProps,
  //
  initialValues,
  onFinish,
  formRef: formRefOrigin,
  children,
  ...otherProps
}: FormProps) => {
  const { setDataToRef } = useHighPage();

  const formRef = useRef<ProFormInstance>();
  useEffect(() => {
    formName && setDataToRef(formName, formRefOrigin ? formRefOrigin.current : formRef.current);
  }, []);

  const handleFinish = useCallback(
    (values) => {
      onFinish && onFinish(values, initialValues);
      return Promise.resolve();
    },
    [initialValues],
  );

  return (
    <FormContext.Provider value={{ readonly }}>
      <Spin spinning={isUndefined(loading) ? false : loading} {...spinProps}>
        <ProForm formRef={formRefOrigin || formRef} onFinish={handleFinish} {...otherProps}>
          {children}
        </ProForm>
      </Spin>
    </FormContext.Provider>
  );
};

export interface HighFormProps extends FormProps, HighProps {}

export const HighForm = ({ formName, ...otherProps }: HighFormProps) => {
  return <ComponentWrapper Component={Form} {...otherProps} />;
};

interface FormOverlayProps {
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  title?: ReactNode | string;
  width?: string | number;
}

export interface ModalFormProps extends Omit<FormProps, "title">, FormOverlayProps {
  modalProps?: Omit<ModalProps, "visible">;
}

const ModalForm = ({
  children,
  //
  visible,
  onVisibleChange,
  title,
  width,
  modalProps,
  //
  formRef: formRefOrigin,
  ...otherProps
}: ModalFormProps) => {
  const formRef = useRef<ProFormInstance>();
  const handleOk = useCallback(() => {
    const ref = formRefOrigin || formRef;
    ref.current?.submit();
  }, []);
  const handleCancel = useCallback((e) => {
    onVisibleChange && onVisibleChange(false);
    modalProps?.onCancel && modalProps.onCancel(e);
  }, []);
  useEffect(() => {
    visible && onVisibleChange && onVisibleChange(true);
  }, [visible]);

  const wrapperProps = pick(otherProps, FormWrapperPropNameList);
  const formProps = omit(otherProps, FormWrapperPropNameList);

  return (
    <Modal visible={visible} title={title} width={width} onOk={handleOk} onCancel={handleCancel} {...modalProps}>
      <Form {...wrapperProps} formRef={formRefOrigin || formRef} submitter={false} {...formProps}>
        {children}
      </Form>
    </Modal>
  );
};

export const HighModalForm = (props: ModalFormProps & HighProps) => {
  return <ComponentWrapper Component={ModalForm} {...props} />;
};

export interface DrawerFormProps extends Omit<FormProps, "title">, FormOverlayProps {
  drawerProps?: Omit<DrawerProps, "visible">;
  cancelButtonProps?: false | ButtonProps;
  okButtonProps?: ButtonProps;
}

const DrawerForm = ({
  children,
  //
  visible,
  onVisibleChange,
  title,
  width,
  drawerProps,
  cancelButtonProps,
  okButtonProps,
  //
  formRef: formRefOrigin,
  ...otherProps
}: DrawerFormProps) => {
  const formRef = useRef<ProFormInstance>();
  const handleOk = useCallback(() => {
    const ref = formRefOrigin || formRef;
    ref.current?.submit();
  }, []);
  const handleCancel = useCallback((e) => {
    onVisibleChange && onVisibleChange(false);
    drawerProps?.onClose && drawerProps.onClose(e);
  }, []);
  useEffect(() => {
    visible && onVisibleChange && onVisibleChange(true);
  }, [visible]);

  const wrapperProps = pick(otherProps, FormWrapperPropNameList);
  const formProps = omit(otherProps, FormWrapperPropNameList);

  return (
    <Drawer
      visible={visible}
      title={title}
      width={width || 800}
      onClose={handleCancel}
      footer={
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
          }}>
          <Space>
            {cancelButtonProps !== false && (
              <Button onClick={handleCancel} {...cancelButtonProps}>
                取消
              </Button>
            )}
            <Button type={"primary"} onClick={handleOk} {...okButtonProps}>
              确定
            </Button>
          </Space>
        </div>
      }
      {...drawerProps}>
      <Form {...wrapperProps} formRef={formRefOrigin || formRef} submitter={false} {...formProps}>
        {children}
      </Form>
    </Drawer>
  );
};

export const HighDrawerForm = (props: DrawerFormProps & HighProps) => {
  return <ComponentWrapper Component={DrawerForm} {...props} />;
};

export interface SearchFormProps extends ProFormProps {
  submitterStyle?: CSSProperties;
  mode?: "button" | "direct";
  //mode为direct时候生效
  debounceKeys?: Array<string>;
  debounceTime?: number;
  //初始化触发onFinish
  initEmit?: boolean;
}

const SearchForm = ({
  submitterStyle,
  mode = "button",
  debounceKeys = [],
  debounceTime = 600,
  initEmit,
  onValuesChange,
  ...otherProps
}: SearchFormProps) => {
  const submitRef = useRef<() => void>();

  const debounceSubmit = useCallback(
    debounce(() => {
      submitRef.current && submitRef.current();
    }, debounceTime),
    [],
  );

  useEffect(() => {
    initEmit && debounceSubmit();
  }, []);

  const handleValuesChange = useCallback((changedValues, values) => {
    if (mode === "direct" && submitRef.current) {
      const ks = keys(changedValues);
      if (size(ks) > 0 && indexOf(debounceKeys, ks[0]) > -1) {
        debounceSubmit();
      } else {
        submitRef.current();
      }
    }
    onValuesChange && onValuesChange(changedValues, values);
  }, []);

  return (
    <Form
      {...otherProps}
      onValuesChange={handleValuesChange}
      style={{ padding: "0 24px", ...otherProps.style }}
      submitter={{
        resetButtonProps: false,
        render: (props, dom) => {
          submitRef.current = get(props, "submit");
          if (mode !== "button") {
            return null;
          }
          return (
            <div style={{ display: "flex", flexDirection: "row-reverse", flexGrow: 1, ...submitterStyle }}>{dom}</div>
          );
        },
        ...otherProps.submitter,
      }}
    />
  );
};

export interface HighSearchFormProps extends SearchFormProps, HighProps {}

export const HighSearchForm = (props: HighSearchFormProps) => <ComponentWrapper Component={SearchForm} {...props} />;

export interface HighFormListProps extends ProFormListProps, HighProps {}

export const HighFormList = (props: HighFormListProps) => {
  return <ComponentWrapper Component={ProFormList} {...props} />;
};
