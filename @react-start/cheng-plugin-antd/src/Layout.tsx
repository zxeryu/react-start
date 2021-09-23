import { PageContainerProps } from "@ant-design/pro-layout/lib/components/PageContainer";
import { HighProps, useHigh, useHighPage } from "@react-start/cheng-high";
import { ElementListProps, ElementProps } from "./types";
import { PageContainer, WaterMark } from "@ant-design/pro-layout";
import { get } from "lodash";
import React, { useCallback } from "react";
import ProCard, { ProCardProps } from "@ant-design/pro-card";
import { ProCardTabPaneProps } from "@ant-design/pro-card/lib/type";
import { ProCardDividerProps } from "@ant-design/pro-card/lib/components/Divider";
import { WaterMarkProps } from "@ant-design/pro-layout/lib/components/WaterMark";

export interface HighPageContainerProps
  extends Omit<PageContainerProps, "footer" | "content" | "extraContent" | "tabBarExtraContent">,
    HighProps {
  footer?: ElementListProps;
  content?: ElementProps;
  extraContent?: ElementProps;
  tabBarExtraContent?: ElementProps;
}

export const HighPageContainer = ({
  highConfig,
  //
  footer,
  content,
  extraContent,
  tabBarExtraContent,
  //
  ...otherProps
}: HighPageContainerProps) => {
  const { renderElementList, renderElement } = useHigh();
  const { getStateValues } = useHighPage();

  return (
    <PageContainer
      {...otherProps}
      {...getStateValues(highConfig?.receiveStateList, otherProps)}
      footer={renderElementList(footer || [])}
      content={content ? renderElement(content) : undefined}
      extraContent={extraContent ? renderElement(extraContent) : undefined}
      tabBarExtraContent={tabBarExtraContent ? renderElement(tabBarExtraContent) : undefined}>
      {renderElementList(get(highConfig, ["highInject", "elementList"], []))}
    </PageContainer>
  );
};

export interface HighCardProps extends Omit<ProCardProps, "extra">, HighProps {
  extra?: ElementProps;
  actions?: ElementListProps;
}

export const HighCard = ({ highConfig, onSend, extra, actions, ...otherProps }: HighCardProps) => {
  const { renderElementList, renderElement, getStateValues, sendEventSimple } = useHighPage();

  const handleTabChange = useCallback((activeKey) => {
    sendEventSimple(highConfig, onSend, { key: "onTabChange", payload: { activeKey } });
  }, []);

  return (
    <ProCard
      {...otherProps}
      tabs={{
        ...otherProps.tabs,
        onChange: handleTabChange,
      }}
      {...getStateValues(highConfig?.receiveStateList, otherProps)}
      extra={extra ? renderElement(extra) : undefined}
      actions={renderElementList(actions || [])}>
      {renderElementList(get(highConfig, ["highInject", "elementList"], []))}
    </ProCard>
  );
};

export interface HighCardTabPaneProps extends ProCardTabPaneProps, HighProps {}

export const HighCardTabPane = ({ highConfig, ...otherProps }: HighCardTabPaneProps) => {
  const { renderElementList, getStateValues } = useHighPage();
  return (
    <ProCard.TabPane {...otherProps} {...getStateValues(highConfig?.receiveStateList, otherProps)}>
      {renderElementList(get(highConfig, ["highInject", "elementList"], []))}
    </ProCard.TabPane>
  );
};

export interface HighCardDividerProps extends ProCardDividerProps {}

export const HighCardDivider = (props: HighCardDividerProps) => {
  return <ProCard.Divider {...props} />;
};

export interface HighWaterMarkProps extends WaterMarkProps {}

export const HighWaterMark = (props: HighWaterMarkProps) => {
  return <WaterMark {...props} />;
};
