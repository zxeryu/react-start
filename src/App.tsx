import React, { useState } from "react";
import { map, get } from "lodash";
import { FormDemo } from "./component/FormDemo";
import { DragOperatorDemo } from "./component/DragOperatorDemo";
import { ReWriteComponent } from "./component/ReWriteComponent";
import { DragShowPage } from "./drag/DragShowPage";
import { RxDemo } from "./component/RxDemo";
import { AntdDemo } from "./plugin-antd/Demo";

const Routes = {
  FormDemo,
  DragOperatorDemo,
  ReWriteComponent,
  DragShowPage,
  RxDemo,
  AntdDemo,
};

export const App = () => {
  const [current, setCurrent] = useState<string>(location.pathname.substring(1, location.pathname.length));

  const Content = get(Routes, current);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          paddingBottom: 10,
          borderBottom: "1px solid rgba(0,0,0,0.2)",
          marginBottom: 10,
        }}>
        {map(Routes, (_, k) => (
          <span
            key={k}
            style={{ margin: "0 .3em", cursor: "pointer", color: current === k ? "blue" : "#666" }}
            onClick={() => {
              history.pushState(null, k, `/${k}`);
              setCurrent(k);
            }}>
            {k}
          </span>
        ))}
      </div>
      <div style={{ flexGrow: 1 }}>{Content && <Content />}</div>
    </div>
  );
};
