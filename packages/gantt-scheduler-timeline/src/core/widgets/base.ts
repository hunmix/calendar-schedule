import { LayoutRect } from "../../types/core";
import { BaseMark } from "../marks/base";
import { WidgetType, getDefaultMarkConfig } from "../defaultConfig";

export class BaseWidget {
  marks: BaseMark[] = [];
  type: WidgetType = "bar";
  rect: LayoutRect = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    width: 0,
    height: 0,
  };
  option: any;
  constructor(option: any) {
    this.option = { ...getDefaultMarkConfig(this.type), ...option };
  }

  updateRect(rect: LayoutRect) {
    this.rect = rect;
  }

  updateLayout(rect: LayoutRect) {
    this.rect = rect;
  }

  updateStyle() {}

  getGraphics() {
    return this.marks.map((v) => v.getGraphic());
  }

  release() {
    this.marks.forEach((mark) => mark.release());
  }
}
