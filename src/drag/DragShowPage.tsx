import React, { useEffect, useState } from "react";
import { get } from "lodash";

export const DragShowPage = () => {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    window.addEventListener("message", (e) => {
      const type = get(e.data, "type");
      if (type === "update") {
        setCount((prevState) => prevState + 1);
      }
    });
  }, []);

  return (
    <div>
      DragShowPage
      {count}
      <button onClick={() => setCount((prevState) => prevState + 1)}>update</button>
    </div>
  );
};
