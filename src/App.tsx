import React, { useState } from "react";
import { map, get } from "lodash";
import { FormDemo } from "./component/FormDemo";
import { FormHighDemo } from "./component/FormHighDemo";

const Routes = {
  FormDemo: FormDemo,
  FormHighDemo: FormHighDemo,
};

export const App = () => {
  const [current, setCurrent] = useState<string>(location.pathname.substring(1, location.pathname.length));

  const Content = get(Routes, current);

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        {map(Routes, (_, k) => (
          <span
            style={{ margin: "0 .3em", cursor: "pointer", color: current === k ? "blue" : "#666" }}
            onClick={() => {
              history.pushState(null, k, `/${k}`);
              setCurrent(k);
            }}>
            {k}
          </span>
        ))}
      </div>
      {Content && <Content />}
    </div>
  );
};
