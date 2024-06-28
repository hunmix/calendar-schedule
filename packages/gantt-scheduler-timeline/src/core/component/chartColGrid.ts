import {
  IArcAttribute,
  IGroup,
  ILayout,
  ILine,
  IRect,
  IText,
  Stage,
  createGroup,
  createLine,
  createRect,
  createText,
} from "@visactor/vrender";
import { DataStore } from "../data/dataStore";
import { GridLayout } from "../layout/gridLayout";
import { TimeScale } from "../timeScale";
import Schedule, { Tick } from "../schedule";

export class ChartColGrid {
  name: "ChartColGrid" = "ChartColGrid";
  group?: IGroup;
  lineMark: ILine;
  rect: any;
  constructor(rect: any, data?: any) {
    this.rect = rect;
    this.lineMark = createLine({
      ...rect,
      stroke: "#ccc",
      ...data,
    });
  }

  append(group: IGroup) {
    if (this.group) {
      throw Error(`${this.name} already exists in a group`);
    }
    this.group = group;
    this.group.add(this.lineMark);
  }

  compile() {}

  resize() {}

  release() {
    this.lineMark.release();
  }
}
