import { useCallback, useRef } from "react";

const MIN_DISTANCE = 10;

type Direction = "" | "vertical" | "horizontal";

const getDirection = (x: number, y: number): Direction => {
  if (x > y && x > MIN_DISTANCE) {
    return "horizontal";
  }
  if (y > x && y > MIN_DISTANCE) {
    return "vertical";
  }
  return "";
};

export const useTouch = () => {
  const point = useRef<{
    startX: number;
    startY: number;
    deltaX: number;
    deltaY: number;
    offsetX: number;
    offsetY: number;
    direction: Direction;
  }>({
    startX: 0,
    startY: 0,
    deltaX: 0,
    deltaY: 0,
    offsetX: 0,
    offsetY: 0,
    direction: "",
  });

  const isVertical = useCallback(() => point.current.direction === "vertical", []);
  const isHorizontal = useCallback(() => point.current.direction === "horizontal", []);

  const reset = useCallback(() => {
    point.current.deltaX = 0;
    point.current.deltaY = 0;
    point.current.offsetX = 0;
    point.current.offsetY = 0;
    point.current.direction = "";
  }, []);

  const start = useCallback((event: TouchEvent) => {
    reset();
    point.current.startX = event.touches[0].clientX;
    point.current.startY = event.touches[0].clientY;
  }, []);

  const move = useCallback((event: TouchEvent) => {
    const t = event.touches[0];
    // Fix: Safari back will set clientX to negative number
    point.current.deltaX = t.clientX < 0 ? 0 : t.clientX - point.current.startX;
    point.current.deltaY = t.clientY - point.current.startY;
    point.current.offsetX = Math.abs(point.current.deltaX);
    point.current.offsetY = Math.abs(point.current.deltaY);

    if (!point.current.direction) {
      point.current.direction = getDirection(point.current.offsetX, point.current.offsetY);
    }
  }, []);

  return {
    point,
    move,
    start,
    reset,
    isVertical,
    isHorizontal,
  };
};
