import { isDate, map, times, padStart, findIndex } from "lodash";
import { range } from "../../utils/format";
import React, { useCallback, useMemo, useState } from "react";
import { ColumnType, DatetimePickerType, getMonthEndDay } from "./utils";
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
    [`${type}Year`]: year,
    [`${type}Month`]: month,
    [`${type}Day`]: day,
    [`${type}Hour`]: hour,
    [`${type}Minute`]: minute,
  };
};

const TimeKeys = ["year", "month", "day", "hour", "minute"];

const getValue = (date: Date, type: string) => {
  let value = 0;
  switch (type) {
    case "year":
      value = date.getFullYear();
      break;
    case "month":
      value = date.getMonth() + 1;
      break;
    case "day":
      value = date.getDate();
      break;
    case "hour":
      value = date.getHours();
      break;
    case "minute":
      value = date.getMinutes();
      break;
  }
  return value;
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
    const { maxYear, maxDay, maxMonth, maxHour, maxMinute } = getDateBoundary(maxDate, selectValue, "max");
    const { minYear, minDay, minMonth, minHour, minMinute } = getDateBoundary(minDate, selectValue, "min");

    let result: Array<{ type: ColumnType; range: number[] }> = [
      {
        type: "year",
        range: [minYear, maxYear],
      },
      {
        type: "month",
        range: [minMonth, maxMonth],
      },
      {
        type: "day",
        range: [minDay, maxDay],
      },
      {
        type: "hour",
        range: [minHour, maxHour],
      },
      {
        type: "minute",
        range: [minMinute, maxMinute],
      },
    ];

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
    return map(ranges, ({ range }) => {
      return map(times(range[1] - range[0] + 1), (index) => {
        const str = padStart(String(index + range[0]), 2, "0");
        return { label: str, value: str };
      });
    });
  }, [ranges]);

  const dateToIndexes = useCallback(
    (date: Date) => {
      return map(columns, (sub, index) => {
        const type = TimeKeys[index];
        const v = getValue(date, type);
        const tv = padStart(String(v), 2, "0");
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
