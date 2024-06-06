import { IGroup, Stage, createGroup } from "@visactor/vrender";
import { Header } from "../../types/core";
import { Timeline } from "./timeline";
import { TimeScale } from "../timeScale";
import { BaseComponent } from "../component/base";
import { DataStore } from "../data/dataStore";
import { Dayjs } from "dayjs";
import { GridLayout } from "../layout/gridLayout";

export interface CalenderConfig {
  start: Dayjs;
  end: Dayjs;
  headers: Header[];
  unitWidth: number;
}

export class Calender extends BaseComponent {
  headers: Header[] = [];
  start: Dayjs;
  end: Dayjs;
  option: CalenderConfig;
  timelines: Timeline[] = [];
  layout!: GridLayout;
  unitWidth: number;
  constructor(option: CalenderConfig, stage: Stage, timeScale: TimeScale) {
    super(stage, timeScale);
    this.option = option;
    const { start, end, unitWidth } = option;
    this.stage = stage;
    this.start = start;
    this.end = end;
    this.unitWidth = unitWidth;
  }

  init() {
    const { headers } = this.option;
    this.headers = headers;
    this.timelines = headers.map(
      (v) =>
        new Timeline(
          {
            ...v,
          },
          this.stage,
          this.timeScale
        )
    );
    const maxCount = Math.max(...this.timelines.map((v) => v.count));
    this.layout.setColContentSize(this.colIndex!, maxCount * this.unitWidth);
  }

  reLayout() {
    const rect = this.getLayoutRect();
    this.timelines.reduce((preTotalHeight, timeline) => {
      timeline.reLayout({
        ...rect,
        y1: rect.y1 + preTotalHeight,
        y2: rect.y1 + preTotalHeight + timeline.height,
        height: timeline.height,
      });
      return preTotalHeight + timeline.height;
    }, 0);
  }

  compile() {
    this.timelines.forEach((v) => {
      v.compile(this.group);
    });
    this.stage.defaultLayer.add(this.group);
  }
}
