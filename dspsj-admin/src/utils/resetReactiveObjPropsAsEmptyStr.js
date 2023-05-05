import { isReactive } from "vue";
/**
 * 重置reactive对象属性为''
 * @param {*} obj
 * @returns
 */
export const resetReactiveObjPropsAsEmptyStr = (obj) => {
  if (!isReactive(obj)) {
    return false;
  }
  for (const key of Object.keys(obj)) {
    obj[key] = "";
  }
};


