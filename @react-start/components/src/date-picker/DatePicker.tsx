import { isDate, map, times, padStart, findIndex, get } from "lodash";
import { range } from "../../utils/format";
import React, { useCallback, useMemo, useState } from "react";
import { DatetimePickerType, getMonthEndDay } from "./utils";
import { Picker } from "../picker";

const currentYear = new Date().getFullYear();

const getDateBoundary = (minDate: Date, value: Date, type: "min" | "max") => {
  const year = minDate.getFullYear();
  let month = 1;
  let day = 1;
  let hour = 0;
  let minute = 0;

  if (type === "max") {
    month = 12;
    day = getMonthEndDay(value.getFullYear(), value.getMonth() + 1);
    hour = 23;
    minute = 59;
  }

  if (value.getFullYear() === year) {
    month = minDate.getMonth() + 1;
    if (value.getMonth() + 1 === month) {
      day = minDate.getDate();
      if (value.getDate() === day) {
        hour = minDate.getHours();
        if (value.getHours() === hour) {
          minute = minDate.getMinutes();
        }
      }
    }
  }
  return {
    [`${type}-year`]: year,
    [`${type}-month`]: month,
    [`${type}-day`]: day,
    [`${type}-hour`]: hour,
    [`${type}-minute`]: minute,
  };
};

interface TimeObject {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

type TimeKey = keyof TimeObject;

const TimeKeys: Array<TimeKey> = ["year", "month", "day", "hour", "minute"];

const getTimeObj = (date: Date) => {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
  };
};

export const DatePicker = ({
  type = "date",
  minDate = new Date(currentYear - 10, 0, 1),
  maxDate = new Date(currentYear + 10, 11, 31),
  value,
}: {
  type?: DatetimePickerType;
  minDate?: Date;
  maxDate?: Date;
  value?: Date;
}) => {
  const formatValue = useCallback(
    (value?: Date) => {
      if (isDate(value)) {
        const timestamp = range(value.getTime(), minDate.getTime(), maxDate.getTime());
        return new Date(timestamp);
      }
      return undefined;
    },
    [minDate, maxDate],
  );

  const [selectValue, setSelectValue] = useState<Date>(() => formatValue(value) || maxDate);

  const ranges = useMemo(() => {
    const minBoundary = getDateBoundary(minDate, selectValue, "min");
    const maxBoundary = getDateBoundary(maxDate, selectValue, "max");

    let result: Array<[number, number]> = map(TimeKeys, (key) => [
      get(minBoundary, `min-${key}`),
      get(maxBoundary, `max-${key}`),
    ]);

    switch (type) {
      case "year-month":
        result = result.slice(0, 2);
        break;
      case "date":
        result = result.slice(0, 3);
        break;
      case "date-hour":
        result = result.slice(0, 4);
        break;
      case "date-minute":
        result = result.slice(0, 5);
        break;
    }

    return result;
  }, [selectValue, minDate, maxDate, type, selectValue]);

  const columns = useMemo(() => {
    return map(ranges, (range) => {
      return map(times(range[1] - range[0] + 1), (index) => {
        const str = padStart(String(index + range[0]), 2, "0");
        return { label: str, value: str };
      });
    });
  }, [ranges]);

  const dateToIndexes = useCallback(
    (date: Date) => {
      const timeObj = getTimeObj(date);
      return map(columns, (sub, index) => {
        const tv = padStart(String(get(timeObj, TimeKeys[index])), 2, "0");
        const i = findIndex(sub, ({ value }) => value === tv);
        return i > 0 ? i : 0;
      });
    },
    [columns],
  );

  const handleChange = useCallback(
    (indexes: number[]) => {
      const selectTimes = map(columns, (sub, index) => {
        return sub[indexes[index] || 0];
      });
      const nextTimes = map(TimeKeys, (_, index) => {
        const v = selectTimes[index]?.value || "0";
        return parseInt(v, 10);
      });
      const maxDay = getMonthEndDay(nextTimes[0], nextTimes[1]);
      if (nextTimes[2] > maxDay) {
        nextTimes[2] = maxDay;
      }

      const nextDate = new Date(nextTimes[0], nextTimes[1] - 1, nextTimes[2], nextTimes[3], nextTimes[4]);
      setSelectValue(nextDate);
    },
    [columns, selectValue],
  );

  return <Picker mode={"multi"} columns={columns} value={dateToIndexes(selectValue)} onChange={handleChange} />;
};
