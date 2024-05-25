import { IGraphicAttribute, IRectGraphicAttribute } from "@visactor/vrender";
import { BaseMark } from "./base";
import { RectMark } from "./rect";

export type GraphicType = "rect" | "text";

export const createGraphic = (
  type: GraphicType,
  attr: Partial<IGraphicAttribute | IRectGraphicAttribute>
): BaseMark => {
  switch (type) {
    case "rect":
      return new RectMark(attr);
    default:
      return new RectMark(attr);
  }
};
