import { inBrowser } from "./base";

export const range = (num: number, min: number, max: number): number => {
  return Math.min(Math.max(num, min), max);
};

// cache
let rootFontSize: number;

const getRootFontSize = () => {
  if (!rootFontSize) {
    const doc = document.documentElement;
    const fontSize = doc.style.fontSize || window.getComputedStyle(doc).fontSize;

    rootFontSize = parseFloat(fontSize);
  }

  return rootFontSize;
};

const convertRem = (value: string) => {
  value = value.replace(/rem/g, "");
  return +value * getRootFontSize();
};

const convertVw = (value: string) => {
  value = value.replace(/vw/g, "");
  return (+value * window.innerWidth) / 100;
};

const convertVh = (value: string) => {
  value = value.replace(/vh/g, "");
  return (+value * window.innerHeight) / 100;
};

export const unitToPx = (value: string | number): number => {
  if (typeof value === "number") {
    return value;
  }

  if (inBrowser) {
    if (value.includes("rem")) {
      return convertRem(value);
    }
    if (value.includes("vw")) {
      return convertVw(value);
    }
    if (value.includes("vh")) {
      return convertVh(value);
    }
  }

  return parseFloat(value);
};
