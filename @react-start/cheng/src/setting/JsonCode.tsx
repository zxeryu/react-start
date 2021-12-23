import React, { useCallback, useEffect, useState } from "react";
import { Modal, ModalProps, Input, message } from "antd";
import { useCheng } from "../Cheng";
import { TextAreaProps } from "antd/lib/input/TextArea";
import { updateElement } from "../util";
import { isArray } from "lodash";

export const JsonCodeModal = ({
  areaProps,
  mode = "edit",
  ...otherProps
}: ModalProps & { areaProps?: TextAreaProps; mode?: "read" | "edit" }) => {
  const { currentElement, setCurrentElement, configData, onConfigChange } = useCheng();

  const [value, setValue] = useState<string>();

  useEffect(() => {
    if (!currentElement || !currentElement.elementProps$) {
      return;
    }
    setValue(JSON.stringify(currentElement.elementProps$, null, "\t"));
  }, [currentElement]);

  const handleSubmit = useCallback(() => {
    if (!value) {
      message.warn("请输入数据");
      return;
    }
    let realValue = "";
    try {
      realValue = JSON.parse(value);
    } catch (e) {
      message.error("请输入正确json格式数据");
      return;
    }
    if (!currentElement || !configData || !onConfigChange) {
      return;
    }
    const nextElement = {
      ...currentElement,
      elementProps$: realValue,
    };
    const nextConfig = {
      ...configData,
      page: updateElement(isArray(configData.page) ? configData.page : [configData.page], nextElement),
    };
    onConfigChange(nextConfig);
  }, [value, currentElement, configData]);

  if (!currentElement) {
    return null;
  }

  return (
    <Modal
      visible
      title={currentElement.elementType$}
      maskClosable={mode === "edit"}
      footer={mode === "edit" ? undefined : null}
      onCancel={() => {
        setCurrentElement(undefined);
      }}
      onOk={handleSubmit}
      width={800}
      {...otherProps}>
      {mode === "edit" ? (
        <Input.TextArea
          style={{
            height: "60vh",
          }}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          {...areaProps}
        />
      ) : (
        <div
          style={{
            height: "60vh",
            overflowY: "auto",
          }}>
          <pre>
            <code>{JSON.stringify(currentElement.elementProps$, null, "\t")}</code>
          </pre>
        </div>
      )}
    </Modal>
  );
};
