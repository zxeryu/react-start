import { PageContainerProps } from "@ant-design/pro-layout/lib/components/PageContainer";
import { HighProps, useHighPage, ComponentWrapper } from "@react-start/cheng-high";
import { ElementListProps, ElementProps } from "./types";
import { PageContainer, WaterMark } from "@ant-design/pro-layout";
import React, { useCallback } from "react";
import ProCard, { ProCardProps } from "@ant-design/pro-card";
import { ProCardTabPaneProps } from "@ant-design/pro-card/lib/type";
import { ProCardDividerProps } from "@ant-design/pro-card/lib/components/Divider";
import { WaterMarkProps } from "@ant-design/pro-layout/lib/components/WaterMark";

export interface HighPageContainerProps
  extends Omit<PageContainerProps, "footer" | "content" | "extraContent" | "tabBarExtraContent" | "tags" | "extra">,
    HighProps {
  tags?: ElementListProps;
  extra?: ElementProps;
  footer?: ElementListProps;
  content?: ElementProps;
  extraContent?: ElementProps;
  tabBarExtraContent?: ElementProps;
}

export const HighPageContainer = ({
  highConfig,
  onSend,
  //
  tags,
  extra,
  //
  content,
  extraContent,
  //
  tabBarExtraContent,
  footer,
  //
  ...otherProps
}: HighPageContainerProps) => {
  const { sendEventSimple, render } = useHighPage();

  return (
    <ComponentWrapper
      Component={PageContainer}
      renderChild
      highConfig={highConfig}
      {...otherProps}
      tags={render(tags) as any}
      extra={render(extra)}
      footer={render(footer)}
      content={render(content)}
      extraContent={render(extraContent)}
      tabBarExtraContent={render(tabBarExtraContent)}
      onTabChange={(activeKey: string) => {
        sendEventSimple(highConfig, onSend, { payload: { activeKey } });
      }}
    />
  );
};

export interface HighCardProps extends Omit<ProCardProps, "extra">, HighProps {
  extra?: ElementProps;
  actions?: ElementListProps;
}

export const HighCard = ({ extra, actions, ...otherProps }: HighCardProps) => {
  const { sendEventSimple, render } = useHighPage();

  const handleTabChange = useCallback((activeKey) => {
    sendEventSimple(otherProps.highConfig, otherProps.onSend, { key: "onTabChange", payload: { activeKey } });
  }, []);

  return (
    <ComponentWrapper
      Component={ProCard}
      renderChild
      {...otherProps}
      extra={render(extra)}
      tabs={otherProps.tabs ? { ...otherProps.tabs, onChange: handleTabChange } : undefined}
    />
  );
};

export interface HighCardTabPaneProps extends ProCardTabPaneProps, HighProps {}

export const HighCardTabPane = (props: HighCardTabPaneProps) => {
  return <ComponentWrapper Component={ProCard.TabPane} renderChild {...props} />;
};

export interface HighCardDividerProps extends ProCardDividerProps {}

export const HighCardDivider = (props: HighCardDividerProps) => {
  return <ProCard.Divider {...props} />;
};

export interface HighWaterMarkProps extends WaterMarkProps {}

export const HighWaterMark = (props: HighWaterMarkProps) => {
  return <WaterMark {...props} />;
};
