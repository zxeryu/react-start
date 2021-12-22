import React from "react";
import { HighPage } from "@react-start/cheng-high";
import { ListEventHandler } from "./ListEventHandler";
import configData from "./List.high.json";

export const List = () => {
  return (
    <HighPage configData={configData as any}>
      <ListEventHandler />
    </HighPage>
  );
};
