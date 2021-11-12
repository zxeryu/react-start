import React, { AnchorHTMLAttributes, HTMLAttributes, ImgHTMLAttributes } from "react";
import { HighProps } from "../types";
import { ComponentWrapper } from "./Wrapper";

export interface HighDivProps extends HTMLAttributes<HTMLDivElement>, HighProps {}

const Div = (props: HTMLAttributes<HTMLDivElement>) => {
  return <div {...props} />;
};

export const HighDiv = (props: HighDivProps) => {
  return <ComponentWrapper Component={Div} {...props} />;
};

export interface HighAProps extends AnchorHTMLAttributes<HTMLAnchorElement>, HighProps {}

const A = (props: AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return <a {...props} />;
};

export const HighA = (props: HighAProps) => {
  return <ComponentWrapper Component={A} {...props} />;
};

export interface HighImgProps extends ImgHTMLAttributes<HTMLImageElement>, HighProps {}

const Img = (props: ImgHTMLAttributes<HTMLImageElement>) => {
  return <img {...props} />;
};

export const HighImg = (props: HighImgProps) => {
  return <ComponentWrapper Component={Img} noChild {...props} />;
};

export interface HighPProps extends HTMLAttributes<HTMLParagraphElement>, HighProps {}

const P = (props: HTMLAttributes<HTMLParagraphElement>) => {
  return <p {...props} />;
};

export const HighP = (props: HighPProps) => {
  return <ComponentWrapper Component={P} {...props} />;
};

export interface HighSpanProps extends HTMLAttributes<HTMLSpanElement>, HighProps {}

const Span = (props: HTMLAttributes<HTMLSpanElement>) => {
  return <span {...props} />;
};

export const HighSpan = (props: HighSpanProps) => {
  return <ComponentWrapper Component={Span} {...props} />;
};

export interface HighHeaderProps extends HTMLAttributes<HTMLElement>, HighProps {}

const Header = (props: HTMLAttributes<HTMLElement>) => {
  return <header {...props} />;
};

export const HighHeader = (props: HighHeaderProps) => {
  return <ComponentWrapper Component={Header} {...props} />;
};

export interface HighFooterProps extends HTMLAttributes<HTMLElement>, HighProps {}

const Footer = (props: HTMLAttributes<HTMLElement>) => {
  return <footer {...props} />;
};

export const HighFooter = (props: HighFooterProps) => {
  return <ComponentWrapper Component={Footer} {...props} />;
};

export interface HighBProps extends HTMLAttributes<HTMLElement>, HighProps {}

const B = (props: HTMLAttributes<HTMLElement>) => {
  return <b {...props} />;
};

export const HighB = (props: HighBProps) => {
  return <ComponentWrapper Component={B} {...props} />;
};

export const HighBr = (props: HTMLAttributes<HTMLBRElement>) => {
  return <br {...props} />;
};
