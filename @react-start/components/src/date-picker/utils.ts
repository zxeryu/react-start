/**
 * form: vant
 */

export type ColumnType = "year" | "month" | "day" | "hour" | "minute";

export type DatetimePickerType = "date" | "time" | "date-minute" | "date-hour" | "year-month";

export const times = <T>(n: number, iteratee: (index: number) => T) => {
  let index = -1;
  const result: T[] = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }

  return result;
};

export const getTrueValue = (value: string | undefined): number => {
  if (!value) {
    return 0;
  }

  while (Number.isNaN(parseInt(value, 10))) {
    if (value.length > 1) {
      value = value.slice(1);
    } else {
      return 0;
    }
  }

  return parseInt(value, 10);
};

export const getMonthEndDay = (year: number, month: number): number => {
  return 32 - new Date(year, month - 1, 32).getDate();
};
