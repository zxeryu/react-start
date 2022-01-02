import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo } from "react";
import axios, { AxiosInstance, AxiosInterceptorManager, AxiosRequestConfig, AxiosResponse } from "axios";
import { paramsSerializer, transformRequest, transformResponse } from "./utils";
import { forEach, get, set, clone } from "lodash";
import { Subject } from "rxjs";
import { createRequestObservable, IRequestActor } from "./createRequest";

const RequestContext = createContext<{
  client: AxiosInstance;
  requestSubject$: Subject<IRequestActor>;
  dispatchRequest: (actor: IRequestActor, params?: IRequestActor["req"], extra?: IRequestActor["extra"]) => void;
}>({} as any);

export const useRequestContext = () => useContext(RequestContext);

export type TRequestInterceptor = (
  request: AxiosInterceptorManager<AxiosRequestConfig>,
  response: AxiosInterceptorManager<AxiosResponse>,
) => void;

export const ContentTypeInterceptor: TRequestInterceptor = (request) => {
  request.use((requestConfig) => {
    if (!get(requestConfig, ["headers", "Content-Type"])) {
      set(requestConfig, ["headers", "Content-Type"], "application/json");
    }
    return requestConfig;
  });
};

const SubGlobalRequestEvent = () => {
  const { client, requestSubject$ } = useRequestContext();

  useEffect(() => {
    const sub = createRequestObservable(requestSubject$, client).subscribe((actor) => {
      requestSubject$.next(actor);
    });
    return () => {
      sub.unsubscribe();
    };
  }, []);

  return null;
};

export const RequestProvider = ({
  children,
  interceptors,
  options,
}: {
  children: ReactNode;
  interceptors?: TRequestInterceptor[];
  options?: AxiosRequestConfig;
}) => {
  const client = useMemo(() => {
    const c = axios.create({
      paramsSerializer,
      transformResponse,
      transformRequest,
      ...options,
    });

    forEach(interceptors, (interceptor) => {
      interceptor(c.interceptors.request, c.interceptors.response);
    });

    return c;
  }, []);

  const requestSubject$ = useMemo(() => new Subject<IRequestActor>(), []);

  const dispatchRequest = useCallback(
    (actor: IRequestActor, params?: IRequestActor["req"], extra?: IRequestActor["extra"]) => {
      const operatorActor = clone(actor);
      operatorActor.req = params;
      operatorActor.extra = extra;
      requestSubject$.next(operatorActor);
    },
    [],
  );

  return (
    <RequestContext.Provider value={{ client, requestSubject$, dispatchRequest }}>
      <SubGlobalRequestEvent />
      {children}
    </RequestContext.Provider>
  );
};
