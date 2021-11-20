import React, { useEffect } from "react";
import { Button } from "@material-ui/core";
import {
  useRequestContext,
  createRequestActor,
  isDoneRequestActor,
  useRequest,
  useDirectRequest,
} from "@react-start/request";

import { createUseState, createUseMetaState } from "@react-start/cheng-high";

import { filter as rxFilter, tap as rxTap } from "rxjs";

export const searchApi = createRequestActor<any, any>("search", ({ q }) => {
  return {
    method: "GET",
    url: `/search/suggestions`,
    params: {
      q,
    },
  };
});

const useCurrentTest = createUseState("test-current", "");

const useMetaTest = createUseMetaState(searchApi, { q: "@vue-start" });

export const RequestDemo = () => {
  const { requestSubject$, dispatchRequest } = useRequestContext();

  const [request, requesting$] = useRequest(searchApi, {
    onSuccess: (actor) => {
      console.log("222222", actor);
    },
  });

  const [data] = useDirectRequest(searchApi, { q: "@react-start" }, []);
  console.log("3333", data);

  const [data2] = useMetaTest();
  console.log("44444", data2);

  useEffect(() => {
    requesting$.subscribe((flag) => {
      console.log("#####", flag);
    });
  }, [requesting$]);

  useEffect(() => {
    const sub = requestSubject$
      .pipe(
        rxFilter(isDoneRequestActor),
        rxTap((actor) => {
          console.log("1111111111", actor);
        }),
      )
      .subscribe();
    return () => {
      sub.unsubscribe();
    };
  }, []);

  const [testCurrent, setTestCurrent] = useCurrentTest();

  console.log("testCurrent===", testCurrent);

  return (
    <div>
      <Button
        onClick={() => {
          dispatchRequest(searchApi, { q: "@react-start" });
        }}>
        search @react-start form npmjs
      </Button>
      <Button
        onClick={() => {
          request({ q: "@react-start" });
        }}>
        search @react-start form npmjs way 2
      </Button>
      <button
        onClick={() => {
          setTestCurrent(new Date().valueOf().toString());
        }}>
        test-current
      </button>
    </div>
  );
};
