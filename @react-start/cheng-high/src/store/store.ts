import { Actor, useSelector, useStore } from "@reactorx/core";
import { useHigh } from "../HighProvider";
import { get, isFunction } from "lodash";
import { useCallback } from "react";

const StateActor = Actor.of("state");

const updateState = StateActor.named<(prev: any) => any, { key: string }>("update").effectOn(
  (actor) => actor.opts.key,
  (state, actor) => {
    return actor.arg(state);
  },
);

export type TUpdater<T> = (prev: T) => T;

export const useUpdateStateHandle = () => {
  const store$ = useStore();

  return useCallback((key: string, value: any) => {
    updateState
      .with(
        () => {
          return value;
        },
        { key },
      )
      .invoke(store$);
  }, []);
};

export const useStoreState$ = <T>(
  topic: string,
  initialState: undefined | T | (() => T),
  persistOpts: { crossTabs?: boolean } = {},
) => {
  const { name } = useHigh();

  const crossTabs = get(persistOpts, "crossTabs");

  const finalKey = `${crossTabs ? "$" : ""}${name || ""}${topic}`;

  const initials = isFunction(initialState) ? initialState() : initialState;

  const store$ = useStore();

  const update = useCallback(
    (stateOrUpdater: T | TUpdater<T>) => {
      return updateState
        .with(
          (prev = initials) => {
            if (isFunction(stateOrUpdater)) {
              return stateOrUpdater(prev);
            }
            return stateOrUpdater;
          },
          { key: finalKey },
        )
        .invoke(store$);
    },
    [finalKey],
  );

  const state = useSelector(store$, (state) => get(state, [finalKey], initials), [finalKey]);

  return [state, update] as const;
};

export const createUseState =
  <T>(topic: string, initialState: undefined | T | (() => T), persistOpts: { crossTabs?: boolean } = {}) =>
  () => {
    const [state, setState] = useStoreState$(topic, initialState, persistOpts);
    return [state, setState] as const;
  };
