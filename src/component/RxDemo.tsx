import React, { useEffect, useMemo } from "react";
import { Subject } from "rxjs";

export const RxDemo = () => {
  const subject$ = useMemo(() => new Subject<{ type: string; payload: any }>(), []);

  useEffect(() => {
    const sub = subject$.subscribe({
      next: (v) => {
        console.log("1111111", v);
        if (v.type === "222") {
          setTimeout(() => {
            subject$.next({ type: "result", payload: 333 });
          }, 2000);
        }
      },
    });
    return () => {
      sub.unsubscribe();
    };
  }, []);

  return (
    <div>
      Rx Demo
      <button onClick={() => subject$.next({ type: "111", payload: 1 })}>next 1</button>
      <button onClick={() => subject$.next({ type: "222", payload: 2 })}>next 2</button>
    </div>
  );
};
