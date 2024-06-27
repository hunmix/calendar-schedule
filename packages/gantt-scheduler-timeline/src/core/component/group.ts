import {
  IArcAttribute,
  IGraphic,
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
import { LayoutItem } from "../layout/layoutItem";

export class LayoutGroup {
  name: "group" = "group";
  group?: IGroup;
  outerGroup: IGroup;
  innerGroup: IGroup;
  layout?: LayoutItem;
  rect: any;
  constructor(rect?: IRect) {
    this.outerGroup = createGroup({
      ...(rect ?? {}),
      clip: true,
    });
    this.innerGroup = createGroup({
      ...(rect ?? {}),
      clip: true,
    });
    this.outerGroup.add(this.innerGroup);
  }

  append(group: IGroup) {
    if (this.group) {
      throw Error(`${this.name} already exists in a group`);
    }
    this.group = group;
    this.group.add(this.outerGroup);
  }

  add(graphic: IGraphic) {
    this.innerGroup.add(graphic);
  }

  bindLayout(layoutItem: LayoutItem) {
    this.layout = layoutItem;
  }

  getInnerGroup() {
    return this.innerGroup;
  }

  compile() {}

  resize() {
    if (!this.layout) return;
    const rect = this.layout.getRect();
    console.log(rect)
    this.outerGroup.setAttributes({
      ...rect,
      x: rect.x1,
      y: rect.y1,
    });
    this.innerGroup.setAttributes({
      ...rect,
      x: 0,
      y: 0,
    });
  }

  release() {
    this.outerGroup.release();
  }
}
