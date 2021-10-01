import React, { CSSProperties, useCallback, useRef } from "react";
import ProForm, {
  ProFormInstance,
  ProFormProps,
  ProFormList,
  ProFormListProps,
  ModalForm,
  DrawerForm,
  ModalFormProps,
  DrawerFormProps,
} from "@ant-design/pro-form";
import { HighProps, useHighPage } from "@react-start/cheng-high";
import { get, debounce, keys, size, indexOf, endsWith } from "lodash";
import { ElementProps } from "./types";

export interface HighFormProps extends ProFormProps, HighProps {}

export const HighForm = ({ highConfig, onSend, children, ...otherProps }: HighFormProps) => {
  const { renderElementList, getStateValues, sendEventSimple } = useHighPage();

  const formRef = useRef<ProFormInstance>();

  const handleFinish = useCallback((values) => {
    sendEventSimple(highConfig, onSend, { key: "onFinish", payload: { form: formRef.current, values } });
    return Promise.resolve();
  }, []);

  const handleFinishFailed = useCallback(
    (errorInfo) =>
      sendEventSimple(highConfig, onSend, {
        key: "onFinishFailed",
        payload: { form: formRef.current, ...errorInfo },
      }),
    [],
  );

  const handleFieldsChange = useCallback((changedFields, allFields) => {
    sendEventSimple(highConfig, onSend, {
      key: "onFieldsChange",
      payload: { form: formRef.current, changedFields, allFields },
      defaultSend: false,
    });
  }, []);

  const handleValuesChange = useCallback((changedValues, values) => {
    sendEventSimple(highConfig, onSend, {
      key: "onValuesChange",
      payload: { form: formRef.current, changedValues, values },
    });
  }, []);

  return (
    <ProForm
      formRef={formRef}
      {...otherProps}
      {...getStateValues(highConfig?.receiveStateList, otherProps)}
      onFinish={handleFinish}
      onFinishFailed={handleFinishFailed}
      onFieldsChange={handleFieldsChange}
      onValuesChange={handleValuesChange}>
      {renderElementList(get(highConfig, ["highInject", "elementList"], []))}
      {children}
    </ProForm>
  );
};

export interface HighSearchFormProps extends HighFormProps {
  submitterStyle?: CSSProperties;
  mode?: "button" | "direct";
  //mode为direct时候生效
  debounceKeys?: Array<string>;
  debounceTime?: number;
}

export const HighSearchForm = ({
  submitterStyle,
  mode = "button",
  debounceKeys = [],
  debounceTime = 600,
  ...otherProps
}: HighSearchFormProps) => {
  const { sendEvent } = useHighPage();

  const submitRef = useRef<() => void>();

  const debounceSubmit = useCallback(
    debounce(() => {
      submitRef.current && submitRef.current();
    }, debounceTime),
    [],
  );

  return (
    <HighForm
      {...otherProps}
      onSend={(action) => {
        if (endsWith(action.type, "onValuesChange")) {
          const changedValues = action.payload.changedValues;
          if (mode === "direct" && submitRef.current) {
            const ks = keys(changedValues);
            if (size(ks) > 0 && indexOf(debounceKeys, ks[0]) > -1) {
              debounceSubmit();
            } else {
              submitRef.current();
            }
          }
        }
        sendEvent(action);
      }}
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

interface OverlayFormWrapperProps extends HighProps {
  trigger: ElementProps;
}

const OverlayFormWrapper = <T extends OverlayFormWrapperProps>({
  Component,
  highConfig,
  onSend,
  trigger,
  ...otherProps
}: T & {
  Component: typeof ModalForm | typeof DrawerForm;
}) => {
  const { renderElementList, renderElement, getStateValues, sendEventSimple } = useHighPage();

  const formRef = useRef<ProFormInstance>();

  const handleVisibleChange = useCallback((visible: boolean) => {
    sendEventSimple(highConfig, onSend, { key: "onVisibleChange", payload: visible });
  }, []);

  const handleFinish = useCallback((values) => {
    sendEventSimple(highConfig, onSend, {
      key: "onFinish",
      payload: { form: formRef.current, values },
    });
    return Promise.resolve();
  }, []);

  const handleValuesChange = useCallback((changedValues, values) => {
    sendEventSimple(highConfig, onSend, {
      key: "onValuesChange",
      payload: { form: formRef.current, changedValues, values },
    });
  }, []);

  const stateProps = getStateValues(highConfig?.receiveStateList, otherProps);

  return (
    <Component
      formRef={formRef}
      {...otherProps}
      {...stateProps}
      onVisibleChange={handleVisibleChange}
      onValuesChange={handleValuesChange}
      onFinish={handleFinish}
      trigger={renderElement(trigger) as any}>
      {renderElementList(get(highConfig, ["highInject", "elementList"], []))}
    </Component>
  );
};

export interface HighModalFormProps extends Omit<ModalFormProps, "trigger">, OverlayFormWrapperProps {}

export const HighModalForm = (props: HighModalFormProps) => {
  return <OverlayFormWrapper<HighModalFormProps> Component={ModalForm} {...props} />;
};

export interface HighDrawerFormProps extends Omit<DrawerFormProps, "trigger">, OverlayFormWrapperProps {}

export const HighDrawerForm = (props: HighDrawerFormProps) => {
  return <OverlayFormWrapper<HighDrawerFormProps> Component={DrawerForm} {...props} />;
};

export interface HighFormListProps extends ProFormListProps, HighProps {}

export const HighFormList = ({ highConfig, ...otherProps }: HighFormListProps) => {
  const { renderElementList } = useHighPage();
  return (
    <ProFormList {...otherProps}>{renderElementList(get(highConfig, ["highInject", "elementList"], []))}</ProFormList>
  );
};
