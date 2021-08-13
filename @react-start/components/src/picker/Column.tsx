/**
 * from vant
 * @constructor
 */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { size, map, get } from "lodash";
import { range } from "../utils/format";
import { IOption } from "../type";
import { useTouch } from "@react-start/hooks";

const DEFAULT_DURATION = 200;

// 惯性滑动思路:
// 在手指离开屏幕时，如果和上一次 move 时的间隔小于 `MOMENTUM_LIMIT_TIME` 且 move
// 距离大于 `MOMENTUM_LIMIT_DISTANCE` 时，执行惯性滑动
const MOMENTUM_LIMIT_TIME = 300;
const MOMENTUM_LIMIT_DISTANCE = 15;

const getElementTranslateY = (element: Element) => {
  const style = window.getComputedStyle(element);
  const transform = style.transform || style.webkitTransform;
  const translateY = transform.slice(7, transform.length - 1).split(", ")[5];

  return Number(translateY);
};

const isOptionDisabled = (option: IOption) => {
  return get(option, "disabled", false);
};

export const Column = ({
  itemHeight,
  swipeDuration,
  visibleItemCount,
  index = 0,
  options = [],
  readonly,
  onChange,
}: {
  itemHeight: number;
  swipeDuration: number;
  visibleItemCount: number;
  index?: number;
  options?: IOption[];
  readonly?: boolean;
  onChange?: (index: number) => void;
}) => {
  const movingRef = useRef<boolean>(false);
  const startOffsetRef = useRef<number>(0);
  const touchStartTimeRef = useRef<number>(0);
  const momentumOffsetRef = useRef<number>(0);
  const transitionEndTriggerRef = useRef<null | (() => void)>();

  const wrapperRef = useRef<HTMLUListElement | null>(null);

  const [state, setState] = useState<{
    offset: number;
    duration: number;
    options: IOption[];
  }>({
    offset: 0,
    duration: 0,
    options,
  });
  const indexRef = useRef<number>(index);
  const offsetRef = useRef<number>(0);
  offsetRef.current = state.offset;

  const touch = useTouch();

  const countRef = useRef<number>(0);
  countRef.current = size(state.options);

  const baseOffset = useCallback(() => {
    return (itemHeight * (visibleItemCount - 1)) / 2;
  }, [itemHeight, visibleItemCount]);

  const adjustIndex = useCallback(
    (index: number) => {
      index = range(index, 0, countRef.current);
      for (let i = index; i < countRef.current; i++) {
        if (!isOptionDisabled(state.options[i])) return i;
      }
      for (let i = index - 1; i >= 0; i--) {
        if (!isOptionDisabled(state.options[i])) return i;
      }
      return 0;
    },
    [state.options],
  );

  const setIndex = useCallback((index: number, emitChange?: boolean) => {
    index = adjustIndex(index) || 0;
    const offset = -index * itemHeight;
    const trigger = () => {
      if (index !== indexRef.current) {
        indexRef.current = index;

        if (emitChange && onChange) {
          onChange(index);
        }
      }
    };

    // trigger the change event after transitionend when moving
    if (movingRef.current && offset !== offsetRef.current) {
      transitionEndTriggerRef.current = trigger;
    } else {
      trigger();
    }
    setState((prevState) => ({ ...prevState, offset }));
  }, []);

  useEffect(() => {
    if (options) {
      setState((prevState) => ({ ...prevState, options }));
    }
  }, [options]);

  useEffect(() => {
    setIndex(index);
  }, [index]);

  const onClickItem = useCallback((index: number) => {
    if (movingRef.current || readonly) {
      return;
    }
    transitionEndTriggerRef.current = null;
    setState((prevState) => ({ ...prevState, duration: DEFAULT_DURATION }));
    setIndex(index, true);
  }, []);

  const getIndexByOffset = useCallback(
    (offset: number) => {
      return range(Math.round(-offset / itemHeight), 0, countRef.current - 1);
    },
    [itemHeight],
  );

  const momentum = useCallback((distance: number, duration: number) => {
    const speed = Math.abs(distance / duration);
    distance = offsetRef.current + (speed / 0.003) * (distance < 0 ? -1 : 1);
    const index = getIndexByOffset(distance);
    setState((prevState) => ({ ...prevState, duration: prevState.duration + swipeDuration }));
    setIndex(index, true);
  }, []);

  const stopMomentum = useCallback(() => {
    movingRef.current = false;
    setState((prevState) => ({ ...prevState, duration: 0 }));
    if (transitionEndTriggerRef.current) {
      transitionEndTriggerRef.current();
      transitionEndTriggerRef.current = null;
    }
  }, []);

  const onTouchStart = useCallback((event: TouchEvent) => {
    if (readonly) {
      return;
    }
    touch.start(event);

    let offset = offsetRef.current;
    let changeOffset = false;
    if (movingRef.current) {
      const translateY = getElementTranslateY(wrapperRef.current!);
      offset = Math.min(0, translateY - baseOffset());
      changeOffset = true;
    }
    startOffsetRef.current = offset;

    setState((prevState) => {
      const newState = { ...prevState };
      if (changeOffset) {
        newState.offset = offset;
      }
      return { ...newState, duration: 0 };
    });
    touchStartTimeRef.current = Date.now();
    momentumOffsetRef.current = startOffsetRef.current;
    transitionEndTriggerRef.current = null;
  }, []);

  const onTouchMove = useCallback((event: TouchEvent) => {
    if (readonly) {
      return;
    }
    touch.move(event);

    if (touch.isVertical()) {
      movingRef.current = true;
      // event.preventDefault();
      event.stopPropagation();
    }

    const offset = range(
      startOffsetRef.current + touch.point.current.deltaY,
      -(countRef.current * itemHeight),
      itemHeight,
    );
    setState((prevState) => ({
      ...prevState,
      offset,
    }));

    const now = Date.now();
    if (now - touchStartTimeRef.current > MOMENTUM_LIMIT_TIME) {
      touchStartTimeRef.current = now;
      momentumOffsetRef.current = offset;
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    if (readonly) {
      return;
    }
    const distance = offsetRef.current - momentumOffsetRef.current;
    const duration = Date.now() - touchStartTimeRef.current;
    const allowMomentum = duration < MOMENTUM_LIMIT_TIME && Math.abs(distance) > MOMENTUM_LIMIT_DISTANCE;

    if (allowMomentum) {
      momentum(distance, duration);
      return;
    }

    const index = getIndexByOffset(offsetRef.current);
    setIndex(index, true);
    setState((prevState) => ({ ...prevState, duration: DEFAULT_DURATION }));

    // compatible with desktop scenario
    // use setTimeout to skip the click event Emitted after touchstart
    setTimeout(() => {
      movingRef.current = false;
    }, 0);
  }, []);

  return (
    <div
      style={{
        flex: 1,
        overflow: "hidden",
      }}
      onTouchStart={onTouchStart as any}
      onTouchMove={onTouchMove as any}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}>
      <ul
        ref={wrapperRef}
        style={{
          transform: `translate3d(0, ${state.offset + baseOffset()}px, 0)`,
          transitionDuration: `${state.duration}ms`,
          transitionProperty: state.duration ? "all" : "none",
          transitionTimingFunction: "cubic-bezier(0.23, 1, 0.68, 1)",
        }}
        onTransitionEnd={stopMomentum}>
        {map(state.options, (option, index) => {
          const disabled = isOptionDisabled(option);

          return (
            <li
              key={get(option, "value", index)}
              role={"button"}
              style={{
                height: `${itemHeight}px`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ...(disabled ? { cursor: "not-allowed", opacity: 0.4 } : null),
              }}
              tabIndex={disabled ? -1 : 0}
              onClick={() => onClickItem(index)}>
              <div>{get(option, "label", option)}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
