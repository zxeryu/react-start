import { SetGroupProp } from "../types";

export const HighSettingConfig: SetGroupProp = {
  name: "highConfig",
  groupType: "object",
  children: [
    { name: "sendEventName", valueType: "text" },
    {
      name: "receiveStateList",
      groupType: "array",
      children: [
        { name: "name", valueType: "text" },
        { name: "mapName", valueType: "text" },
      ],
    },
    {
      name: "receivePropsList",
      groupType: "array",
      children: [
        { name: "name", valueType: "text" },
        { name: "mapName", valueType: "text" },
      ],
    },
    {
      name: "transformElementList",
      groupType: "array",
      children: [
        { name: "name", valueType: "text" },
        { name: "isFunction", valueType: "switch" },
      ],
    },
  ],
};
