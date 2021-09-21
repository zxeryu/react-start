import React, { useCallback, useRef } from "react";
import ProForm, { ProFormInstance, ProFormProps } from "@ant-design/pro-form";
import { HighProps, useHigh, useHighPage } from "@react-start/cheng-high";
import { get } from "lodash";
import { FieldData, ValidateErrorEntity } from "rc-field-form/lib/interface";

export interface HighFormProps extends ProFormProps, HighProps {}

export const HighForm = ({ highConfig, onSend, children, ...otherProps }: HighFormProps) => {
  const { renderElementList } = useHigh();
  const { getStateValues, sendEvent } = useHighPage();

  const formRef = useRef<ProFormInstance>();

  const handleFinish: HighFormProps["onFinish"] = useCallback((values) => {
    if (highConfig?.sendEventName) {
      sendEvent({ type: `${highConfig.sendEventName}:onFinish`, payload: { form: formRef.current, values } });
    }
    return Promise.resolve();
  }, []);

  const handleFinishFailed: HighFormProps["onFinishFailed"] = useCallback((errorInfo: ValidateErrorEntity) => {
    if (highConfig?.sendEventName) {
      sendEvent({
        type: `${highConfig.sendEventName}:onFinishFailed`,
        payload: { form: formRef.current, ...errorInfo },
      });
    }
  }, []);

  const handleFieldsChange: HighFormProps["onFieldsChange"] = useCallback(
    (changedFields: FieldData[], allFields: FieldData[]) => {
      if (highConfig?.sendEventName) {
        sendEvent({
          type: `${highConfig.sendEventName}:onFieldsChange`,
          payload: { form: formRef.current, changedFields, allFields },
        });
      }
    },
    [],
  );
  const handleValuesChange: HighFormProps["onValuesChange"] = useCallback((changedValues: any, values: any) => {
    if (highConfig?.sendEventName) {
      sendEvent({
        type: `${highConfig.sendEventName}:onValuesChange`,
        payload: { form: formRef.current, changedValues, values },
      });
    }
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
