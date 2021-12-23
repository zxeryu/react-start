import React, { useCallback, useRef } from "react";
import ProForm, {
  ProFormList,
  ProFormGroup,
  ProFormText,
  ProFormTextArea,
  ProFormDigit,
  ProFormMoney,
  ProFormSelect,
  ProFormCheckbox,
  ProFormRadio,
  ProFormSwitch,
  ProFormRate,
  ProFormSlider,
  ProFormProps,
  ProFormInstance,
} from "@ant-design/pro-form";
import { IElement, SetGroupProp, SetItemProp } from "./types";
import { map, get, omit, size, isArray, mergeWith } from "lodash";
import { isGroupSetting, updateElement } from "./util";
import { useCheng } from "./Cheng";
import { Modal, ModalProps } from "antd";

const ElementTypeMap = {
  text: ProFormText,
  textarea: ProFormTextArea,
  digit: ProFormDigit,
  money: ProFormMoney,
  select: ProFormSelect,
  checkbox: ProFormCheckbox,
  radio: ProFormRadio,
  switch: ProFormSwitch,
  rate: ProFormRate,
  slider: ProFormSlider,
};

const appendPath = (name: string, parent?: string) => {
  if (!parent) {
    return name;
  }
  return `${parent}.${name}`;
};

const Item = ({ item, parent }: { item: SetItemProp; parent?: string }) => {
  const Element = get(ElementTypeMap, item.valueType);
  if (!Element) {
    return null;
  }
  return <Element {...omit(item, "valueType")} name={appendPath(item.name, parent)} label={item.label || item.name} />;
};

const ComposeItem = ({ config, parent }: { config: SetGroupProp; parent?: string }) => {
  if (config.groupType === "array") {
    return (
      <React.Fragment key={config.name}>
        <ProFormGroup label={config.label || config.name} />
        <ProFormList name={appendPath(config.name, parent)}>
          <ProFormGroup>
            {map(config.children, (item: SetItemProp) => (
              <Item key={item.name} item={item} />
            ))}
          </ProFormGroup>
        </ProFormList>
      </React.Fragment>
    );
  }

  return (
    <>
      <ProFormGroup label={config.label || config.name} />
      {map(config.children, (item) => {
        if (isGroupSetting(item)) {
          return <ComposeItem key={item.name} config={item as SetGroupProp} parent={appendPath(item.name, parent)} />;
        }
        return <Item key={item.name} item={item as SetItemProp} parent={appendPath(item.name, parent)} />;
      })}
    </>
  );
};

export const SettingForm = ({ setProps, formProps }: { setProps: IElement["setProps"]; formProps?: ProFormProps }) => {
  return (
    <ProForm {...formProps}>
      {map(setProps, (item) => {
        if (isGroupSetting(item)) {
          return <ComposeItem key={item.name} config={item as SetGroupProp} />;
        }
        const Element = get(ElementTypeMap, (item as SetItemProp).valueType);
        if (!Element) {
          return null;
        }
        return <Element key={item.name} {...omit(item, "valueType")} label={item.label || item.name} />;
      })}
    </ProForm>
  );
};

const customizer = (objValue: any, srcValue: any) => {
  if (isArray(objValue)) {
    return srcValue;
  }
};

export const ElementForm = ({ formProps }: { formProps?: ProFormProps }) => {
  const { elementsMap, currentElement, configData, onConfigChange } = useCheng();

  const handleSubmit = useCallback(
    (values) => {
      if (!currentElement || !configData || !onConfigChange) {
        return;
      }
      const nextElement = {
        ...currentElement,
        elementProps$: mergeWith(currentElement.elementProps$, values, customizer),
      };
      const nextConfig = {
        ...configData,
        page: updateElement(isArray(configData.page) ? configData.page : [configData.page], nextElement),
      };
      onConfigChange(nextConfig);
    },
    [currentElement, configData],
  );

  const elementType$ = get(currentElement, "elementType$");
  if (!elementType$) {
    return null;
  }

  const setProps = get(elementsMap, [elementType$!, "setProps"]);
  if (!setProps || size(setProps) <= 0) {
    return null;
  }

  return (
    <SettingForm
      setProps={setProps}
      formProps={{
        ...formProps,
        onFinish: (values) => {
          handleSubmit(values);
          return Promise.resolve();
        },
      }}
    />
  );
};

export const ElementFormModal = (modalProps: ModalProps) => {
  const { currentElement, setCurrentElement, elementsMap } = useCheng();

  const formRef = useRef<ProFormInstance>();

  if (!currentElement) {
    return null;
  }
  const elementType$ = get(currentElement, "elementType$");
  if (!elementType$) {
    return null;
  }
  const setProps = get(elementsMap, [elementType$!, "setProps"]);
  if (!setProps || size(setProps) <= 0) {
    return null;
  }

  return (
    <Modal
      visible
      title={currentElement.elementType$}
      maskClosable={false}
      onCancel={() => {
        setCurrentElement(undefined);
      }}
      onOk={() => {
        formRef.current?.submit();
      }}
      {...modalProps}
      width={800}>
      <ElementForm
        formProps={{
          formRef,
          initialValues: currentElement.elementProps$,
          style: { maxHeight: "60vh", overflowY: "auto" },
          submitter: false,
        }}
      />
    </Modal>
  );
};
