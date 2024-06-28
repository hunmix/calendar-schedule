import {
  IArcAttribute,
  IGroup,
  ILayout,
  IRect,
  IText,
  Stage,
  createGroup,
  createRect,
  createText,
} from "@visactor/vrender";
import { DataStore } from "../data/dataStore";
import { GridLayout } from "../layout/gridLayout";
import { TimeScale } from "../timeScale";
import Schedule, { Tick } from "../schedule";

export class TaskBar {
  name: "TaskBar" = 'TaskBar';
  group?: IGroup;
  rectMark: IRect;
  titleMark: IText;
  rect: any;
  constructor(rect: any, data?: any) {
    this.rect = rect;
    this.rectMark = createRect({
      ...rect,
      y: rect.y + (rect.height - data.barHeight) / 2,
      height: data.barHeight,
      cornerRadius: 4,
      fill: "lightblue",
    });
    this.titleMark = createText({
      ...rect,
      x: rect.x + rect.width / 2,
      y: rect.y + rect.height / 2,
      fill: "#000",
      textAlign: "center",
      textBaseline: "middle",
      maxLineWidth: rect.width,
      text: data.text
    });
  }

  append(group: IGroup) {
    if (this.group) {
      throw Error(`${this.name} already exists in a group`);
    }
    this.group = group;
    this.group.add(this.rectMark);
    this.group.add(this.titleMark);
  }

  compile() {}

  resize() {}

  release() {
    this.rectMark.release();
  }
}
