import { PageContainerProps } from "@ant-design/pro-layout/lib/components/PageContainer";
import { HighProps, ComponentWrapper, ElementConfigBase } from "@react-start/cheng-high";
import { PageContainer, WaterMark } from "@ant-design/pro-layout";
import React from "react";
import ProCard, { ProCardProps } from "@ant-design/pro-card";
import { ProCardTabPaneProps } from "@ant-design/pro-card/lib/type";
import { ProCardDividerProps } from "@ant-design/pro-card/lib/components/Divider";
import { WaterMarkProps } from "@ant-design/pro-layout/lib/components/WaterMark";

export interface HighPageContainerProps
  extends Omit<PageContainerProps, "footer" | "content" | "extraContent" | "tabBarExtraContent" | "tags" | "extra">,
    HighProps {}

const HighPageContainerTransformList = [
  { name: "tags" },
  { name: "content" },
  { name: "footer" },
  { name: "extra" },
  { name: "extraContent" },
  { name: "tabBarExtraContent" },
];

export const HighPageContainer = (props: HighPageContainerProps) => {
  return (
    <ComponentWrapper Component={PageContainer} transformElementList={HighPageContainerTransformList} {...props} />
  );
};

export interface HighCardProps extends Omit<ProCardProps, "extra">, HighProps {
  extra?: ElementConfigBase;
  actions?: ElementConfigBase[];
}

const HighCardTransformList = [{ name: "extra" }, { name: "actions" }];

export const HighCard = (props: HighCardProps) => {
  return <ComponentWrapper Component={ProCard} transformElementList={HighCardTransformList} {...props} />;
};

export interface HighCardTabPaneProps extends ProCardTabPaneProps, HighProps {}

export const HighCardTabPane = (props: HighCardTabPaneProps) => {
  return <ComponentWrapper Component={ProCard.TabPane} {...props} />;
};

export interface HighCardDividerProps extends ProCardDividerProps {}

export const HighCardDivider = (props: HighCardDividerProps) => {
  return <ProCard.Divider {...props} />;
};

export interface HighWaterMarkProps extends WaterMarkProps {}

export const HighWaterMark = (props: HighWaterMarkProps) => {
  return <WaterMark {...props} />;
};
