import React, { useEffect } from "react";
import { Button } from "@material-ui/core";
import {
  RequestProvider,
  useRequestContext,
  createRequestActor,
  isDoneRequestActor,
  useRequest,
  useDirectRequest,
} from "@react-start/request";
import { filter as rxFilter, tap as rxTap } from "rxjs";

const searchApi = createRequestActor<any, any>("search", ({ q }) => {
  return {
    method: "GET",
    url: `/search/suggestions`,
    params: {
      q,
    },
  };
});

export const Content = () => {
  const { requestSubject$, dispatchRequest } = useRequestContext();

  const [request, requesting$] = useRequest(searchApi, {
    onSuccess: (actor) => {
      console.log("222222", actor);
    },
  });

  const [data] = useDirectRequest(searchApi, { q: "@react-start" }, []);

  console.log("3333", data);

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
    </div>
  );
};

export const RequestDemo = () => (
  <RequestProvider>
    <Content />
  </RequestProvider>
);
