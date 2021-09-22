import React, { CSSProperties, useCallback, useRef } from "react";
import ProForm, { ProFormInstance, ProFormProps } from "@ant-design/pro-form";
import { HighProps, useHigh, useHighPage } from "@react-start/cheng-high";
import { get, debounce, keys, size, indexOf } from "lodash";

export interface HighFormProps extends ProFormProps, HighProps {}

export const HighForm = ({ highConfig, onSend, children, ...otherProps }: HighFormProps) => {
  const { renderElementList } = useHigh();
  const { getStateValues, sendEventSimple } = useHighPage();

  const formRef = useRef<ProFormInstance>();

  return (
    <ProForm
      formRef={formRef}
      {...otherProps}
      {...getStateValues(highConfig?.receiveStateList, otherProps)}
      onFinish={(values) => {
        sendEventSimple(highConfig, onSend, { key: "onFinish", payload: { form: formRef.current, values } });
        return Promise.resolve();
      }}
      onFinishFailed={(errorInfo) => {
        sendEventSimple(highConfig, onSend, {
          key: "onFinishFailed",
          payload: { form: formRef.current, ...errorInfo },
        });
      }}
      onFieldsChange={(changedFields, allFields) => {
        sendEventSimple(highConfig, onSend, {
          key: "onFieldsChange",
          payload: { form: formRef.current, changedFields, allFields },
        });
      }}
      onValuesChange={(changedValues, values) => {
        if (otherProps.onValuesChange) otherProps.onValuesChange(changedValues, values);

        sendEventSimple(highConfig, onSend, {
          key: "onValuesChange",
          payload: { form: formRef.current, changedValues, values },
        });
      }}>
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
      onValuesChange={(changedValues) => {
        if (mode === "direct" && submitRef.current) {
          const ks = keys(changedValues);
          if (size(ks) > 0 && indexOf(debounceKeys, ks[0]) > -1) {
            debounceSubmit();
          } else {
            submitRef.current();
          }
        }
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
