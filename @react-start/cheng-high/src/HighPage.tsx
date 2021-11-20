import { HighPageProvider, HighPageProviderProps, useHighPage } from "./HighPageProvider";
import React, { useEffect } from "react";
import { ElementConfigBase } from "./types";
import { uniq, filter, get, concat, size, reduce, forEach } from "lodash";
import { useStore, shallowEqual } from "@reactorx/core";
import { tap as rxTap } from "rxjs";
import { map as rxOperatorMap, distinctUntilChanged } from "rxjs/operators";
import { useHigh } from "./HighProvider";

export interface HighPageProps extends HighPageProviderProps {
  configData: {
    registerStore?: string[];
    //api name
    registerMeta?: string[];
    page: ElementConfigBase | ElementConfigBase[];
  };
}

const Content = ({ configData }: Omit<HighPageProps, "elementsMap" | "children">) => {
  const store$ = useStore();
  const { dispatchMeta } = useHigh();
  const { render, dispatch } = useHighPage();

  //将注册的 store store-meta绑定到state中
  useEffect(() => {
    const list = concat(get(configData, "registerStore", []), get(configData, "registerMeta", []));
    const storeKeyList = filter(uniq(list), (item) => !!item);

    if (size(storeKeyList) <= 0) {
      return;
    }

    const sub = store$
      .pipe(
        rxOperatorMap((state) => {
          return reduce(
            storeKeyList,
            (pair, key) => {
              return { ...pair, [key]: get(state, key) };
            },
            {},
          );
        }),
        distinctUntilChanged(shallowEqual),
        rxTap((c) => {
          dispatch({ type: "compose", payload: c });
        }),
      )
      .subscribe();

    return () => {
      sub.unsubscribe();
    };
  }, []);

  //如果注册了 registerMeta ，在page初始化的时候发送
  useEffect(() => {
    const metaNameList = get(configData, "registerMeta", []);
    forEach(metaNameList, (requestName) => {
      dispatchMeta(requestName);
    });
  }, []);

  return <>{render(configData.page)}</>;
};

//处理 store store-meta
export const HighPage = ({ elementsMap, children, ...otherProps }: HighPageProps) => (
  <HighPageProvider elementsMap={elementsMap}>
    <Content {...otherProps} />
    {children}
  </HighPageProvider>
);
