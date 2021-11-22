import {
  IRequestActor,
  isPreRequestActor,
  isDoneRequestActor,
  isFailedRequestActor,
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
  return isDoneRequestActor(actor) || isFailedRequestActor(actor);
};

export const useFinishRequestActor = createUseRequestActor(isFinishRequestActor);

export const useComposeRequestActor = (
  requestNameList: string[],
  options: {
    onStart?: (actor: IRequestActor) => void;
    onSuccess?: (actor: IRequestActor) => void;
    onFailed?: (actor: IRequestActor) => void;
    onFinish?: (actor: IRequestActor) => void;
  },
) => {
  const { requestSubject$ } = useRequestContext();

  const nameSet = useMemo(() => new Set(requestNameList || []), []);

  useEffect(() => {
    const sub = requestSubject$
      .pipe(
        rxFilter(isPreRequestActor),
        rxTap((actor) => {
          if (nameSet.has(actor.name)) {
            options.onStart && options.onStart(actor);
          }
        }),
      )
      .pipe(
        rxFilter(isDoneRequestActor),
        rxTap((actor) => {
          if (nameSet.has(actor.name)) {
            options.onSuccess && options.onSuccess(actor);
            options.onFinish && options.onFinish(actor);
          }
        }),
      )
      .pipe(
        rxFilter(isFailedRequestActor),
        rxTap((actor) => {
          if (nameSet.has(actor.name)) {
            options.onFailed && options.onFailed(actor);
            options.onFinish && options.onFinish(actor);
          }
        }),
      )
      .subscribe();

    return () => {
      sub.unsubscribe();
    };
  }, []);
};

export * from "./store-meta";
