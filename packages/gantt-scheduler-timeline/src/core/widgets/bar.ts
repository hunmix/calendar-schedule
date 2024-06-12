import {
  IGraphic,
  IGraphicAttribute,
  IRectGraphicAttribute,
  createRect,
} from "@visactor/vrender";
import { BaseWidget } from "./base";
import { BarMarkDefaultAttr } from "../defaultConfig/mark";
import { RectMark } from "../marks/rect";
import { WidgetType } from "../defaultConfig";
import { BaseMark } from "../marks/base";
import { LayoutRect } from "../../types/core";
import { TextMark } from "../marks/text";
import { TaskData } from "../data/task";

export interface BarWidgetOption extends Partial<IRectGraphicAttribute> {
  height?: number;
  data: TaskData;
}

export class BarWidget extends BaseWidget {
  type: WidgetType = "bar";
  barMark: BaseMark | null = null;
  titleMark: BaseMark | null = null;
  height: number = 0;
  data!: TaskData;
  constructor(option?: BarWidgetOption) {
    super(option);
    const { height, data } = this.option;
    this.height = height;
    this.data = data;
    this.init();
  }

  init() {
    this.initMarks();
  }

  private initMarks() {
    this.initBar();
  }

  private initBar() {
    const { height, cornerRadius, fill } = this.option;
    this.barMark = new RectMark({
      cornerRadius,
      fill,
      height,
    });
    this.titleMark = new TextMark({
      fontSize: 15,
      text: this.data.title,
      fill: "#000",
      textAlign: "center",
      textBaseline: "middle",
    });
    this.barMark.init();
    this.titleMark.init();
    this.marks.push(this.barMark);
  }

  getBarPosition() {
    const { x1, width } = this.rect;
    return {
      x: x1,
      width,
      height: this.height,
      y: this.rect.y1 + (this.rect.height - this.height) / 2,
    };
  }

  getTitlePosition() {
    const { x, y, width, height } = this.getBarPosition();
    return {
      x: x + width / 2,
      y: y + height / 2,
    };
  }

  relayout(rect: LayoutRect) {
    this.rect = rect;
    this.barMark?.update(this.getBarPosition());
    this.titleMark?.update(this.getTitlePosition());
  }

  compile(group: IGraphic) {
    this.barMark?.compile(group);
    this.titleMark?.compile(group);
  }
}
