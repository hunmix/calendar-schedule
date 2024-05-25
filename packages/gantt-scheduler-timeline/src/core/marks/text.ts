import { IGraphic, ITextGraphicAttribute, createText } from "@visactor/vrender";
import { BaseMark } from "./base";
import { GraphicType } from ".";

export class TextMark extends BaseMark {
  type: GraphicType = "text";
  constructor(attr: Partial<ITextGraphicAttribute>) {
    super(attr);
  }

  init() {
    this.graphic = createText(this.attr);
  }
}
