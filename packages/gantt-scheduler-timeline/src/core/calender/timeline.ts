import {
  IGraphic,
  IGroup,
  IRectGraphicAttribute,
  Stage,
  createGroup,
  createRect,
} from "@visactor/vrender";
import { Header, Unit, LayoutRect } from "../../types/core";
import dayjs, { Dayjs } from "dayjs";
import { TimeScale } from "../timeScale";
import { RectMark } from "../marks/rect";
import { TextMark } from "../marks/text";
import { BaseMark } from "../marks/base";

export interface TimelineOptions extends Header {
  unit: Unit;
  step?: number;
  height: number;
  unitWidth?: number;
  autoFit: boolean;
}

export interface Tick {
  startTime: number;
  endTime: number;
  text: string;
}

export class Timeline {
  option: TimelineOptions;
  group: IGroup = createGroup({});
  unit: Unit;
  height: number;
  step: number = 1;
  unitWidth?: number = 0;
  autoFit: boolean = false;
  count: number = 0;
  timeScale: TimeScale;
  graphics: IGraphic[] = [];
  rectMarks: RectMark[] = [];
  titleMarks: TextMark[] = [];
  marks: BaseMark[] = [];
  stage: Stage;
  rect: LayoutRect = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    width: 0,
    height: 0,
  };
  ticks: Tick[] = [];
  format?: string;
  constructor(option: TimelineOptions, stage: Stage, timeScale: TimeScale) {
    const { height, unit, step = 1, format, unitWidth, autoFit } = option;
    this.option = option;
    this.timeScale = timeScale;
    this.unit = unit;
    this.format = format;
    this.step = step;
    this.unitWidth = unitWidth;
    this.autoFit = autoFit;
    this.stage = stage;
    this.height = height;
    this.init();
  }

  private init() {
    this.calcTicks();
    this.initWidget();
  }

  private initWidget() {
    this.getGragphicConfig().forEach((config, index) => {
      this.rectMarks.push(
        new RectMark({
          ...config,
          fill: "#fafafa",
          stroke: "#ccc",
        })
      );
      this.titleMarks.push(
        new TextMark({
          ...config,
          fill: "#000",
          textAlign: "center",
          textBaseline: "middle",
          maxLineWidth: config.width,
        })
      );
    });
    this.marks = [...this.rectMarks, ...this.titleMarks];
  }

  updateLayout(rect: LayoutRect) {
    this.rect = rect;
  }

  private calcTicks() {
    const domain = this.timeScale.getDomain();
    const start = dayjs(domain[0]);
    const end = dayjs(domain[1]);
    this.count = 0;
    let startDate = start;
    while (startDate.isBefore(end)) {
      let endDate = startDate.endOf(this.unit);
      if (endDate.isAfter(end)) {
        endDate = end;
      }
      this.ticks.push({
        startTime: startDate.valueOf(),
        endTime: endDate.valueOf(),
        text: startDate.format(this.format ?? "YYYY-MM-DD"),
      });
      this.count++;
      startDate = startDate.add(1, this.unit).startOf(this.unit);
    }
  }

  getTicks() {
    return this.ticks;
  }

  private getGragphicConfig(): IRectGraphicAttribute[] {
    return this.ticks.map(({ startTime, endTime, text }) => {
      const range = [
        this.timeScale.getValue(startTime),
        this.timeScale.getValue(endTime),
      ];

      return {
        x: range[0],
        y: this.rect.y1,
        width: range[1] - range[0],
        height: this.height,
        text,
      };
    });
  }

  reLayout(rect: LayoutRect) {
    this.rect = rect;
    const config = this.getGragphicConfig();
    this.rectMarks.forEach((v, index) =>
      v.update({
        ...config[index],
      })
    );
    this.titleMarks.forEach((v, index) => {
      v.update({
        ...config[index],
        y: config[index].y! + config[index].height! / 2,
        x: config[index].x! + config[index].width! / 2,
        textAlign: "center",
        textBaseline: "middle",
        maxLineWidth: config[index].width,
      });
    });
  }

  compile(group: IGroup) {
    this.marks.forEach((mark) => mark.compile(group));
  }
}
