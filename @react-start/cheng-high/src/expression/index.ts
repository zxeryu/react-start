import _, { get, has, isObject, map } from "lodash";
import { TDataType, TExecuteItem, TGetValue } from "../types";

/************************************ fun **************************************/

export const lodash = (funcName: string, ...e: any): any => {
  const fun = get(_, funcName);
  if (!fun) {
    return;
  }
  return fun(...e);
};

/************************************ execute **************************************/

const executeLodash = (valueOrDesc: TGetValue, getDataTarget: (type: TDataType) => any) => {
  const funName = get(valueOrDesc, "funName");
  const funParamsList = get(valueOrDesc, "funParams");
  const funParams = map(funParamsList, (v) => {
    //如果为值描述（path）
    if (isObject(v) && has(v, "name")) {
      const name = get(v, "name");
      const target = getDataTarget(get(v, "target"));
      return get(target, name);
    }
    return v;
  });
  return lodash(funName, ...funParams);
};

export const getExecuteParams = (item: TExecuteItem, getDataTarget: (type: TDataType) => any) => {
  const execParamsList = get(item, "execParams");
  return map(execParamsList, (valueOrDesc) => {
    //如果为表达式（lodash方法）
    if (isObject(valueOrDesc) && has(valueOrDesc, "funName")) {
      return executeLodash(valueOrDesc as TGetValue, getDataTarget);
    }
    return valueOrDesc;
  });
};
