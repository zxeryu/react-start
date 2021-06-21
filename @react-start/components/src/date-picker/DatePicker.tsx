import { isDate, map, times, padStart, findIndex, get, slice } from "lodash";
import { range } from "../../utils/format";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Picker, PickerProps } from "../picker";
import { IOption } from "../type";

const currentYear = new Date().getFullYear();

const getMonthEndDay = (year: number, month: number): number => {
  return 32 - new Date(year, month - 1, 32).getDate();
};

const getDateBoundary = (date: Date, value: Date, type: "min" | "max") => {
  const year = date.getFullYear();
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
    month = date.getMonth() + 1;
    if (value.getMonth() + 1 === month) {
      day = date.getDate();
      if (value.getDate() === day) {
        hour = date.getHours();
        if (value.getHours() === hour) {
          minute = date.getMinutes();
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

type DatePickerType = "date" | "time" | "date-minute" | "date-hour" | "year-month" | "month-day";

const PickerTypeMap = {
  "year-month": [0, 2],
  date: [0, 3],
  "date-hour": [0, 4],
  "date-minute": [0, 5],
  time: [3, 5],
  "month-day": [1, 3],
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

const getTimeObj = (date: Date): TimeObject => {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    hour: date.getHours(),
    minute: date.getMinutes(),
  };
};

export interface DatePickerProps extends Omit<PickerProps, "onChange" | "value" | "onConfirm"> {
  type?: DatePickerType;
  minDate?: Date;
  maxDate?: Date;
  value?: Date;
  defaultValue?: Date;
  onChange?: (date?: Date) => void;
  onConfirm?: (date?: Date) => void;
  formatter?: (val: string, type: TimeKey) => string;
  filter?: (options: IOption[], type: TimeKey) => IOption[];
}

export const DatePicker = ({
  type = "date",
  formatter,
  minDate = new Date(currentYear - 10, 0, 1),
  maxDate = new Date(currentYear + 10, 11, 31),
  value,
  defaultValue = new Date(),
  onChange,
  onConfirm,
  ...props
}: DatePickerProps) => {
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

  const [selectValue, setSelectValue] = useState<Date>(() => formatValue(value) || defaultValue || maxDate);

  const columns = useMemo(() => {
    const minBoundary = getDateBoundary(minDate, selectValue, "min");
    const maxBoundary = getDateBoundary(maxDate, selectValue, "max");

    const result: Array<[number, number]> = map(TimeKeys, (key) => [
      get(minBoundary, `min-${key}`),
      get(maxBoundary, `max-${key}`),
    ]);

    return map(result, (range, index) => {
      const timeKey = TimeKeys[index];
      const cs = map(times(range[1] - range[0] + 1), (i) => {
        const v = i + range[0];
        const str = padStart(String(v), 2, "0");
        return { label: formatter ? formatter(str, timeKey) : str, value: v };
      });
      if (props.filter) {
        return props.filter(cs, timeKey);
      }
      return cs;
    });
  }, [selectValue, minDate, maxDate, type, selectValue]);

  const showColumns = useMemo(() => {
    return slice(columns, ...get(PickerTypeMap, type, [0, 3]));
  }, [columns, type]);
  const showColumnsRef = useRef<IOption[][]>(showColumns);
  showColumnsRef.current = showColumns;

  const dateToIndexes = useCallback(
    (date: Date) => {
      const timeObj = getTimeObj(date);
      const start = get(PickerTypeMap, type, [0, 3])[0];
      return map(showColumnsRef.current, (sub, index) => {
        const v = get(timeObj, TimeKeys[index + start]);
        // const tv = padStart(String(get(timeObj, TimeKeys[index + start])), 2, "0");
        const i = findIndex(sub, ({ value }) => value === v);
        return i > 0 ? i : 0;
      });
    },
    [type],
  );

  const handleChange = useCallback(
    (indexes: number[]) => {
      const timeObj = getTimeObj(selectValue);
      const start = get(PickerTypeMap, type, [0, 3])[0];

      const selectTimes = map(showColumnsRef.current, (sub, index) => {
        return sub[indexes[index] || 0];
      });
      const nextTimes = map(TimeKeys, (_, index) => {
        let v = get(timeObj, TimeKeys[index]) as any;
        if (index >= start && selectTimes[index - start]) {
          v = selectTimes[index - start].value;
        }
        return parseInt(v, 10);
      });
      const maxDay = getMonthEndDay(nextTimes[0], nextTimes[1]);
      if (nextTimes[2] > maxDay) {
        nextTimes[2] = maxDay;
      }
      const nextDate = new Date(nextTimes[0], nextTimes[1] - 1, nextTimes[2], nextTimes[3], nextTimes[4]);
      setSelectValue(nextDate);
      onChange && onChange(nextDate);
    },
    [selectValue, type],
  );

  return (
    <Picker
      mode={"multi"}
      columns={showColumns}
      value={dateToIndexes(selectValue)}
      onChange={handleChange}
      onConfirm={() => {
        onConfirm && onConfirm(selectValue);
      }}
      {...props}
    />
  );
};
