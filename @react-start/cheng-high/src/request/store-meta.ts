import { IRequestActor, useRequest } from "@react-start/request";
import { useStoreState$ } from "../store/store";
import { useEffect } from "react";
import { isEmpty } from "lodash";

const useMetaStoreState$ = (requestActor: IRequestActor, initialParams?: Record<string, any>) => {
  const [state, setState] = useStoreState$(requestActor.name, undefined);

  const [request, requesting$] = useRequest(requestActor, {
    onSuccess: (actor) => {
      setState(actor.res?.data);
    },
  });

  useEffect(() => {
    if (isEmpty(state)) {
      request(initialParams || {});
    }
  }, []);

  return [state, request, requesting$];
};

export const createUseMetaState = (requestActor: IRequestActor, initialParams?: Record<string, any>) => {
  return () => {
    const [state, request, requesting$] = useMetaStoreState$(requestActor, initialParams);
    return [state, request, requesting$] as const;
  };
};
