import { IGroup, Stage, createGroup } from "@visactor/vrender";
import { Header } from "../../types/core";
import { Timeline } from "./timeline";
import { TimeScale } from "../timeScale";
import { BaseComponent } from "../component/base";
import { DataStore } from "../data/dataStore";
import { Dayjs } from "dayjs";
import { GridLayout } from "../layout/gridLayout";
import { isNil } from "lodash-es";

export interface CalenderConfig {
  start: Dayjs;
  end: Dayjs;
  headers: Header[];
  unitWidth: number;
  autoUnitWidth?: boolean;
}

export class Calender extends BaseComponent {
  headers: Header[] = [];
  start: Dayjs;
  end: Dayjs;
  option: CalenderConfig;
  timelines: Timeline[] = [];
  group: IGroup = createGroup({ clip: true });
  innerGroup: IGroup = createGroup({});
  layout!: GridLayout;
  unitWidth: number;
  autoUnitWidth: boolean = false;
  count: number = 0;
  constructor(option: CalenderConfig, stage: Stage, timeScale: TimeScale) {
    super(stage, timeScale);
    this.option = option;
    const { start, end, unitWidth, autoUnitWidth } = option;
    this.stage = stage;
    this.start = start;
    this.end = end;
    this.unitWidth = unitWidth;
    !isNil(autoUnitWidth) && (this.autoUnitWidth = autoUnitWidth);
    this.group.add(this.innerGroup);
  }

  init() {
    const { headers } = this.option;
    this.headers = headers;
    this.timelines = headers.map(
      (v) =>
        new Timeline(
          {
            ...v,
            unitWidth: this.unitWidth,
          },
          this.stage,
          this.timeScale
        )
    );
    this.count = Math.max(...this.timelines.map((v) => v.count));
  }

  getTicks() {
    // TODO: implement the common logic of getTicks
    return this.timelines[this.timelines.length - 1].getTicks();
  }

  reLayout() {
    const rect = this.getLayoutRect();
    const totalHeight = this.timelines.reduce((preTotalHeight, timeline) => {
      timeline.reLayout({
        ...rect,
        y1: preTotalHeight,
        y2: preTotalHeight + timeline.height,
        height: timeline.height,
        x1: 0,
        x2: rect.width,
      });
      return preTotalHeight + timeline.height;
    }, 0);

    this.group.setAttributes({
      x: rect.x1,
      y: rect.y1,
      width: rect.width,
      height: totalHeight,
    });
    this.innerGroup.setAttributes({
      // x: rect.x1 - rect.offsetX,
      // y: rect.y1 - rect.offsetY,
      x: rect.offsetX,
      y: rect.offsetY,
      width: rect.contentWidth || rect.width,
      height: rect.contentHeight || rect.height,
    });
  }

  compile() {
    this.timelines.forEach((v) => {
      v.compile(this.innerGroup);
    });
    this.stage.defaultLayer.add(this.group);
  }
}
