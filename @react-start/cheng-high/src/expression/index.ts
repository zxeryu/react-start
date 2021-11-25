import _, { get, has, isObject, map } from "lodash";
import { TDataType, TExecuteItem, TGetValue, TParam } from "../types";

/************************************ fun **************************************/

export const lodash = (funcName: string, ...e: any): any => {
  const fun = get(_, funcName);
  if (!fun) {
    return;
  }
  return fun(...e);
};

/************************************ execute **************************************/

const isValueDesc = (desc: TExecuteItem["execParams"]) => {
  return isObject(desc) && has(desc, "name");
};

const getValue = (desc: TParam, getDataTarget: (type: TDataType) => any) => {
  const name = get(desc, "name");
  const target = getDataTarget(get(desc, "target")!);
  return get(target, name);
};

const isLodashDesc = (desc: TExecuteItem["execParams"]) => {
  return isObject(desc) && has(desc, "funName");
};

const getLodashResult = (valueOrDesc: TGetValue, getDataTarget: (type: TDataType) => any) => {
  const funName = get(valueOrDesc, "funName");
  const funParamsList = get(valueOrDesc, "funParams");
  const funParams = map(funParamsList, (v) => {
    //如果为表达式（直接取值）
    if (isValueDesc(v)) {
      return getValue(v, getDataTarget);
    }
    return v;
  });
  return lodash(funName, ...funParams);
};

export const getExecuteParams = (item: TExecuteItem, getDataTarget: (type: TDataType) => any) => {
  const execParamsList = get(item, "execParams");
  return map(execParamsList, (valueOrDesc) => {
    //如果为表达式（lodash方法）
    if (isLodashDesc(valueOrDesc)) {
      return getLodashResult(valueOrDesc as TGetValue, getDataTarget);
    }
    //如果为表达式（直接取值）
    if (isValueDesc(valueOrDesc)) {
      return getValue(valueOrDesc, getDataTarget);
    }
    return valueOrDesc;
  });
};