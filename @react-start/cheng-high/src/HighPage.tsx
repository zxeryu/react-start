import { HighPageProvider, HighPageProviderProps, useHighPage } from "./HighPageProvider";
import React, { useEffect } from "react";
import { ElementConfigBase } from "./types";
import { uniq, filter, get, concat, size, reduce } from "lodash";
import { useStore, shallowEqual } from "@reactorx/core";
import { map as rxOperatorMap, distinctUntilChanged } from "rxjs/operators";

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
      )
      .subscribe((c) => {
        dispatch({
          type: "compose",
          payload: c,
        });
      });

    return () => {
      sub.unsubscribe();
    };
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
