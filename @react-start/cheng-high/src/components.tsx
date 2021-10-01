import React, { AnchorHTMLAttributes, HTMLAttributes, ImgHTMLAttributes, ReactNode, useCallback } from "react";
import { HighProps } from "./types";
import { useHighPage } from "./HighPageProvider";
import { withoutBubble } from "./util";
import { get } from "lodash";

interface CommonWrapperProps extends HighProps {
  bubble?: boolean;
}

export const CommonWrapper = <T extends CommonWrapperProps>({
  Component,
  defaultSend = false,
  //
  highConfig,
  onSend,
  bubble = true,
  //
  children,
  ...otherProps
}: T & {
  Component: any;
  defaultSend?: boolean;
  children?: ReactNode;
}) => {
  const { getStateValues, sendEventSimple, renderElementList } = useHighPage();

  const handleClick = useCallback((e: any) => {
    sendEventSimple(highConfig, onSend, { payload: { e }, defaultSend });
  }, []);

  return (
    <Component
      {...otherProps}
      {...getStateValues(highConfig?.receiveStateList)}
      onClick={bubble ? handleClick : withoutBubble(handleClick)}>
      {children}
      {renderElementList(get(highConfig, ["highInject", "elementList"], []))}
    </Component>
  );
};

export interface HighDivProps extends HTMLAttributes<HTMLDivElement>, CommonWrapperProps {}

const Div = (props: HTMLAttributes<HTMLDivElement>) => {
  return <div {...props} />;
};

export const HighDiv = (props: HighDivProps) => {
  return <CommonWrapper Component={Div} {...props} />;
};

export interface HighAProps extends AnchorHTMLAttributes<HTMLAnchorElement>, CommonWrapperProps {}

const A = (props: AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return <a {...props} />;
};

export const HighA = (props: HighAProps) => {
  return <CommonWrapper Component={A} {...props} defaultSend />;
};

export interface HighImgProps extends ImgHTMLAttributes<HTMLImageElement>, CommonWrapperProps {}

const Img = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  return <img {...props} />;
};

export const HighImg = (props: HighImgProps) => {
  return <CommonWrapper Component={Img} {...props} />;
};

export interface HighPProps extends HTMLAttributes<HTMLParagraphElement>, CommonWrapperProps {}

const P = (props: HTMLAttributes<HTMLParagraphElement>) => {
  return <p {...props} />;
};

export const HighP = (props: HighPProps) => {
  return <CommonWrapper Component={P} {...props} />;
};

export interface HighSpanProps extends HTMLAttributes<HTMLSpanElement>, CommonWrapperProps {}

const Span = (props: HTMLAttributes<HTMLSpanElement>) => {
  return <span {...props} />;
};

export const HighSpan = (props: HighSpanProps) => {
  return <CommonWrapper Component={Span} {...props} />;
};

export interface HighHeaderProps extends HTMLAttributes<HTMLElement>, CommonWrapperProps {}

const Header = (props: HTMLAttributes<HTMLElement>) => {
  return <header {...props} />;
};

export const HighHeader = (props: HighHeaderProps) => {
  return <CommonWrapper Component={Header} {...props} />;
};

export interface HighFooterProps extends HTMLAttributes<HTMLElement>, CommonWrapperProps {}

const Footer = (props: HTMLAttributes<HTMLElement>) => {
  return <footer {...props} />;
};

export const HighFooter = (props: HighFooterProps) => {
  return <CommonWrapper Component={Footer} {...props} />;
};

export interface HighBProps extends HTMLAttributes<HTMLElement>, CommonWrapperProps {}

const B = (props: HTMLAttributes<HTMLElement>) => {
  return <b {...props} />;
};

export const HighB = (props: HighBProps) => {
  return <CommonWrapper Component={B} {...props} />;
};

export const HighBr = (props: HTMLAttributes<HTMLBRElement>) => {
  return <br {...props} />;
};
