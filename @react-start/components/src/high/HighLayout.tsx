import React from "react";
import { Stack, StackProps } from "@material-ui/core";
import { map, get } from "lodash";
import { useHigh } from "./HighProvider";
import { ElementDescProps } from "./types";

interface IHighLayoutData {
  elementProps?: StackProps;
  elementList?: ElementDescProps[];
}

export const HighLayout = ({ data }: { data?: IHighLayoutData }) => {
  const { elementsMap } = useHigh();

  return (
    <Stack {...data?.elementProps}>
      {map(data?.elementList, ({ id, type, elementProps }, index) => {
        const Content = get(elementsMap, type);
        if (!Content) {
          return null;
        }
        return <Content key={id || index} {...elementProps} />;
      })}
    </Stack>
  );
};
