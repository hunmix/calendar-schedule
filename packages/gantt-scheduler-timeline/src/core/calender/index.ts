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
}

export class Calender extends BaseComponent {
  headers: Header[] = [];
  start: Dayjs;
  end: Dayjs;
  option: CalenderConfig;
  timelines: Timeline[] = [];
  layout!: GridLayout;
  constructor(option: CalenderConfig, stage: Stage, timeScale: TimeScale) {
    super(stage, timeScale);
    this.option = option;
    const { start, end } = option;
    this.stage = stage;
    this.start = start;
    this.end = end;
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
  }

  reLayout() {
    const rect = this.getLayoutRect();
    this.timeScale.setRange([rect.x1, rect.x2]);
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
