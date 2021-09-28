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

export interface HighModalFormProps extends Omit<ModalFormProps, "trigger">, HighProps {
  trigger: ElementProps;
  record?: Record<string, any>;
}

export const HighModalForm = ({ highConfig, onSend, trigger, record, ...otherProps }: HighModalFormProps) => {
  const { renderElementList, renderElement, getStateValues, sendEventSimple } = useHighPage();

  const stateProps = getStateValues(highConfig?.receiveStateList, otherProps);
  const recordRef = useRef<Record<string, any>>();
  recordRef.current = stateProps?.record || record;

  const formRef = useRef<ProFormInstance>();

  const handleVisibleChange = useCallback((visible: boolean) => {
    sendEventSimple(highConfig, onSend, { key: "onVisibleChange", payload: visible });
  }, []);

  const handleFinish = useCallback((values) => {
    sendEventSimple(highConfig, onSend, {
      key: "onFinish",
      payload: { form: formRef.current, values: { ...recordRef.current, ...values } },
    });
    return Promise.resolve();
  }, []);

  const handleValuesChange = useCallback((changedValues, values) => {
    sendEventSimple(highConfig, onSend, {
      key: "onValuesChange",
      payload: { form: formRef.current, changedValues, values },
    });
  }, []);

  return (
    <ModalForm
      formRef={formRef}
      {...otherProps}
      {...stateProps}
      initialValues={stateProps?.record || record || otherProps.initialValues}
      submitter={{
        render: (props, dom) => {
          return dom;
        },
        ...otherProps.submitter,
        ...stateProps?.submitter,
      }}
      onVisibleChange={handleVisibleChange}
      onValuesChange={handleValuesChange}
      onFinish={handleFinish}
      trigger={renderElement(trigger) as any}>
      {renderElementList(get(highConfig, ["highInject", "elementList"], []))}
    </ModalForm>
  );
};

export interface HighDrawerFormProps extends Omit<DrawerFormProps, "trigger">, HighProps {
  trigger: ElementProps;
  record?: Record<string, any>;
}

export const HighDrawerForm = ({ highConfig, onSend, trigger, record, ...otherProps }: HighDrawerFormProps) => {
  const { renderElementList, renderElement, getStateValues, sendEventSimple } = useHighPage();

  const stateProps = getStateValues(highConfig?.receiveStateList, otherProps);
  const recordRef = useRef<Record<string, any>>();
  recordRef.current = stateProps?.record || record;

  const formRef = useRef<ProFormInstance>();

  const handleVisibleChange = useCallback((visible: boolean) => {
    sendEventSimple(highConfig, onSend, { key: "onVisibleChange", payload: visible });
  }, []);

  const handleFinish = useCallback((values) => {
    sendEventSimple(highConfig, onSend, {
      key: "onFinish",
      payload: { form: formRef.current, values: { ...recordRef.current, ...values } },
    });
    return Promise.resolve();
  }, []);

  const handleValuesChange = useCallback((changedValues, values) => {
    sendEventSimple(highConfig, onSend, {
      key: "onValuesChange",
      payload: { form: formRef.current, changedValues, values },
    });
  }, []);

  return (
    <DrawerForm
      formRef={formRef}
      {...otherProps}
      {...stateProps}
      initialValues={stateProps?.record || record || otherProps.initialValues}
      onVisibleChange={handleVisibleChange}
      onValuesChange={handleValuesChange}
      onFinish={handleFinish}
      trigger={renderElement(trigger) as any}>
      {renderElementList(get(highConfig, ["highInject", "elementList"], []))}
    </DrawerForm>
  );
};

export interface HighFormListProps extends ProFormListProps, HighProps {}

export const HighFormList = ({ highConfig, ...otherProps }: HighFormListProps) => {
  const { renderElementList } = useHighPage();
  return (
    <ProFormList {...otherProps}>{renderElementList(get(highConfig, ["highInject", "elementList"], []))}</ProFormList>
  );
};
