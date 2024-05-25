import {
  IGraphic,
  IGraphicAttribute,
  INode,
  createRect,
} from "@visactor/vrender";
import { LayoutRect } from "../../types/core";

export class BaseMark {
  attr: any;
  graphic: IGraphic | null = null;
  rect: LayoutRect = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    width: 0,
    height: 0,
  };
  constructor(attr: Partial<IGraphicAttribute>) {
    this.attr = attr;
    this.init();
  }

  init() {
    this.graphic = createRect(this.attr);
  }

  update(attr: any) {
    this.graphic?.setAttributes(attr);
  }

  add(node: INode) {
    this.graphic?.add(node);
  }

  getGraphic() {
    return this.graphic;
  }

  compile(group: IGraphic) {
    group.add(this.getGraphic()!);
  }

  release() {
    this.graphic?.release();
    this.graphic = null;
  }
}
