import {
  IRequestActor,
  isDoneRequestActor,
  isFailedRequestActor,
  isCancelRequestActor,
  useRequestContext,
} from "@react-start/request";
import { useEffect, useMemo } from "react";
import { filter as rxFilter, tap as rxTap } from "rxjs";

const createUseRequestActor = (isFilterActor: (actor: IRequestActor) => boolean) => {
  return (requestNameList: string[], callback: (actor: IRequestActor) => void) => {
    const { requestSubject$ } = useRequestContext();

    const nameSet = useMemo(() => new Set(requestNameList || []), []);

    useEffect(() => {
      const sub = requestSubject$
        .pipe(
          rxFilter(isFilterActor),
          rxTap((actor) => {
            if (nameSet.has(actor.name)) {
              callback(actor);
            }
          }),
        )
        .subscribe();

      return () => {
        sub.unsubscribe();
      };
    }, []);
  };
};

export const useDoneRequestActor = createUseRequestActor(isDoneRequestActor);

export const useFailedRequestActor = createUseRequestActor(isFailedRequestActor);

const isFinishRequestActor = (actor: IRequestActor) => {
  return isDoneRequestActor(actor) || isFailedRequestActor(actor) || isCancelRequestActor(actor);
};

export const useFinishRequestActor = createUseRequestActor(isFinishRequestActor);

export * from "./store-meta";
