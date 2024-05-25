import { BarMarkDefaultAttr } from "./mark";

export type WidgetType = "bar";

const WidgetConfigMap = {
  bar: BarMarkDefaultAttr,
};

export const getDefaultMarkConfig = (type: WidgetType) => {
  return WidgetConfigMap[type];
};
