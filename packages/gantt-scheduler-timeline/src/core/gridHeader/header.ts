import {
  IGraphic,
  IGroup,
  IRectGraphicAttribute,
  ITextGraphicAttribute,
  Stage,
  createGroup,
  createRect,
} from "@visactor/vrender";
import { Header, LayoutRect, Unit } from "../../types/core";
import { Dayjs } from "dayjs";
import { TimeScale } from "../timeScale";
import { ResourceData } from "../data/resouce";
import { RectMark } from "../marks/rect";
import { TextMark } from "../marks/text";
import { BaseMark } from "../marks/base";

export interface GridHeaderOption {
  title: string;
  width: number;
}

export class GridHeader {
  option: GridHeaderOption;
  group: IGroup = createGroup({});
  graphics: IGraphic[] = [];
  marks: BaseMark[] = [];
  rectMark: RectMark | null = null;
  titleMark: TextMark | null = null;
  stage: Stage;
  rect: LayoutRect = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    width: 0,
    height: 0,
  };
  title: string;
  width: number;
  constructor(option: GridHeaderOption, stage: Stage) {
    const { title, width } = option;
    this.option = option;
    this.title = title;
    this.stage = stage;
    this.width = width;
  }

  updateLayout(rect: LayoutRect) {
    this.rect = rect;
  }

  private getGragphicConfig() {
    const rect = {
      x: this.rect.x1,
      y: this.rect.y1,
      width: this.rect.width,
      height: this.rect.height,
    };
    return {
      rect: {
        ...rect,
        fill: "#fff",
        stroke: "#ccc",
        maxLineWidth: rect.width,
      },
      title: {
        ...rect,
        text: this.title,
        x: rect.x + rect.width / 2,
        y: rect.y + rect.height / 2,
        fontSize: 15,
        fill: "#000",
        textAlign: "center",
        textBaseline: "middle",
        maxLineWidth: rect.width,
      } as ITextGraphicAttribute,
    };
  }
  reLayout() {
    const { rect, title } = this.getGragphicConfig();
    this.rectMark?.update(rect);
    this.titleMark?.update(title);
  }

  compile(group: IGroup) {
    const { rect, title } = this.getGragphicConfig();
    this.rectMark = new RectMark(rect);
    this.titleMark = new TextMark(title);
    this.group.add(this.rectMark.getGraphic()!);
    this.group.add(this.titleMark.getGraphic()!);
    this.marks = [this.rectMark, this.titleMark];
    group.add(this.group);
  }
}
