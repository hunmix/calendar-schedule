import { isNil } from "lodash-es";

export interface LayoutItemOption {
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  width?: number;
  height?: number;
  offsetX?: number;
  offsetY?: number;
}

export class LayoutItem {
  x1: number = 0;
  y1: number = 0;
  x2: number = 0;
  y2: number = 0;
  width: number = 0;
  height: number = 0;
  resizeEvents: ((item: LayoutItem) => void)[] = [];
  constructor() {}

  setAttr(attrs: LayoutItemOption) {
    const { x1, y1, x2, y2, width, height } = attrs;
    !isNil(x1) && (this.x1 = x1);
    !isNil(y1) && (this.y1 = y1);
    !isNil(x2) && (this.x2 = x2);
    !isNil(y2) && (this.y2 = y2);
    !isNil(width) && (this.width = width);
    !isNil(height) && (this.height = height);
  }

  getRect() {
    return {
      x1: this.x1,
      y1: this.y1,
      x2: this.x2,
      y2: this.y2,
      width: this.width,
      height: this.height,
    };
  }

  addResizeListenter() {}
}
