import { IGraphic, IRectGraphicAttribute, createRect } from "@visactor/vrender";
import { BaseMark } from "./base";
import { GraphicType } from ".";

export interface BarMarkOption {
  height: number;
}

export class BarMark extends BaseMark {
  type: GraphicType = "rect";
  constructor(attr: Partial<IRectGraphicAttribute>) {
    super(attr);
  }

  init() {
    this.graphic = createRect(this.attr);
  }
}
