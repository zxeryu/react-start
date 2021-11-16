import { IRequestActor, isDoneRequestActor, isFailedRequestActor } from "./createRequest";
import { useRequestContext } from "./RequestContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generateId } from "./utils";
import { merge as rxMerge, filter as rxFilter, tap as rxTap, BehaviorSubject } from "rxjs";
import { get } from "lodash";

export interface IUseRequestOptions<TReq, TRes, TErr> {
  defaultLoading?: boolean;
  onSuccess?: (actor: IRequestActor<TReq, TRes, TErr>) => void;
  onFail?: (actor: IRequestActor<TReq, TRes, TErr>) => void;
  onFinish?: () => void;
}

export const useRequest = <TReq, TRes, TErr>(
  requestActor: IRequestActor<TReq, TRes, TErr>,
  options?: IUseRequestOptions<TReq, TRes, TErr>,
): readonly [
  (
    params: IRequestActor<TReq, TRes, TErr>["req"],
    options?: Pick<IUseRequestOptions<TReq, TRes, TErr>, "onSuccess" | "onFail">,
  ) => void,
  BehaviorSubject<boolean>,
] => {
  const { requestSubject$, dispatchRequest } = useRequestContext();

  const requesting$ = useMemo(() => new BehaviorSubject<boolean>(!!get(options, "defaultLoading")), []);

  const optionsRef = useRef<IUseRequestOptions<TReq, TRes, TErr>>({} as any);
  if (options) {
    optionsRef.current = options;
  }

  const lastRequestActorRef = useRef<IRequestActor<TReq, TRes, TErr> | null>(null);
  const lastCallbackRef = useRef<Pick<IUseRequestOptions<TReq, TRes, TErr>, "onSuccess" | "onFail">>({});

  const cancelIfExists = useCallback(() => {
    lastRequestActorRef.current && dispatchRequest({ ...lastRequestActorRef.current, stage: "CANCEL" });
  }, []);

  useEffect(() => {
    const end = () => {
      lastRequestActorRef.current = null;
      requesting$.next(false);
      options?.onFinish && options.onFinish();
    };

    const isSameRequest = (actor: IRequestActor) => {
      return lastRequestActorRef.current?.name === actor.name && lastRequestActorRef.current?.id === actor.id;
    };

    const sub = rxMerge(
      requestSubject$.pipe(
        rxFilter(isDoneRequestActor),
        rxFilter(isSameRequest),
        rxTap((actor) => {
          lastCallbackRef.current.onSuccess && lastCallbackRef.current.onSuccess(actor);
          optionsRef.current.onSuccess && optionsRef.current.onSuccess(actor);
          end();
        }),
      ),
      requestSubject$.pipe(
        rxFilter(isFailedRequestActor),
        rxFilter(isSameRequest),
        rxTap((actor) => {
          lastCallbackRef.current.onFail && lastCallbackRef.current.onFail(actor);
          optionsRef.current.onFail && optionsRef.current.onFail(actor);
          end();
        }),
      ),
    ).subscribe();
    return () => {
      cancelIfExists();
      sub.unsubscribe();
    };
  }, []);

  const request = useCallback(
    (
      params: IRequestActor<TReq, TRes, TErr>["req"],
      options?: Pick<IUseRequestOptions<TReq, TRes, TErr>, "onSuccess" | "onFail">,
    ) => {
      cancelIfExists();

      lastCallbackRef.current.onSuccess = options?.onSuccess;
      lastCallbackRef.current.onFail = options?.onFail;

      requesting$.next(true);

      const id = generateId();
      const actor = { ...requestActor, id };

      lastRequestActorRef.current = actor;

      dispatchRequest(actor, params);
    },
    [],
  );

  return [request, requesting$] as const;
};

export const useDirectRequest = <TRequestActor extends IRequestActor>(
  requestActor: TRequestActor,
  params: TRequestActor["req"],
  deps: any[] = [],
) => {
  // @ts-ignore
  const [data, setData] = useState<TRequestActor["res"]["data"]>();

  const [req, requesting$] = useRequest(requestActor, {
    // defaultLoading: true,
    onSuccess: (actor) => {
      setData(actor.res?.data);
    },
  });

  const request = useCallback(() => {
    req(params);
  }, []);

  useEffect(() => {
    request();
  }, deps);

  return [data, request, requesting$];
};
