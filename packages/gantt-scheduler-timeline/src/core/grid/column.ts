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

export interface GridColumnOption {
  height?: number;
  resources: ResourceData[];
  field: string;
  width: number;
}

export class GridColumn {
  option: GridColumnOption;
  group: IGroup = createGroup({ clip: true });
  height: number = 50;
  resources: ResourceData[] = [];
  graphics: IGraphic[] = [];
  marks: BaseMark[] = [];
  rectMarks: RectMark[] = [];
  titleMarks: TextMark[] = [];
  stage: Stage;
  rect: LayoutRect = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    width: 0,
    height: 0,
  };
  field: string;
  width: number;
  constructor(option: GridColumnOption, stage: Stage) {
    const { height, resources, field, width } = option;
    this.option = option;
    this.resources = resources;
    this.field = field;
    this.stage = stage;
    this.width = width;
    height && (this.height = height);
    this.init();
  }

  private init() {
    this.initWidget();
  }

  private initWidget() {
    this.getGragphicConfig().forEach(({ rect, title }, index) => {
      this.rectMarks.push(
        new RectMark({
          fill: "#fff",
          stroke: "#ccc",
        })
      );
      this.titleMarks.push(
        new TextMark({
          fontSize: 15,
          fill: "#000",
          textAlign: "center",
          textBaseline: "middle",
        })
      );
      this.marks.push(this.rectMarks[index]);
      this.marks.push(this.titleMarks[index]);
    });
  }

  // private getRect() {

  // }

  // private getRectPosition() {

  // }

  // private getTextPosition() {

  // }

  private getGragphicConfig() {
    return this.resources.map((resourceData, index) => {
      const text = resourceData.originData[this.field] ?? "";
      const rect = {
        // x: this.rect.x1,
        // y: this.rect.y1 + this.height * index,
        x: 0,
        y: 0 + this.height * index,
        width: this.rect.width,
        height: this.height,
      };

      return {
        rect: {
          ...rect,
        },
        title: {
          ...rect,
          text,
          x: rect.x + rect.width / 2,
          y: rect.y + rect.height / 2,
          maxLineWidth: rect.width,
        } as ITextGraphicAttribute,
      };
    });
  }

  reLayout(rect: LayoutRect) {
    this.rect = rect;
    const config = this.getGragphicConfig();
    this.group.setAttributes({
      x: rect.x1,
      y: rect.y1,
      width: rect.width,
      height: rect.height,
    });
    this.rectMarks.forEach((mark, index) => mark.update(config[index].rect));
    this.titleMarks.forEach((mark, index) => mark.update(config[index].title));
  }

  compile(group: IGroup) {
    this.marks.forEach((mark) => mark.compile(this.group));
    group.add(this.group);
  }
}
