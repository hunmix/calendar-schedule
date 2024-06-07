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
  layout!: GridLayout;
  unitWidth: number;
  autoUnitWidth: boolean = false;
  constructor(option: CalenderConfig, stage: Stage, timeScale: TimeScale) {
    super(stage, timeScale);
    this.option = option;
    const { start, end, unitWidth, autoUnitWidth } = option;
    this.stage = stage;
    this.start = start;
    this.end = end;
    this.unitWidth = unitWidth;
    !isNil(autoUnitWidth) && (this.autoUnitWidth = autoUnitWidth);
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
    this.updateScrollContentSize();
  }

  updateScrollContentSize() {
    const maxCount = Math.max(...this.timelines.map((v) => v.count));
    if (!this.autoUnitWidth && !isNil(this.unitWidth)) {
      this.layout.setColContentSize(this.colIndex!, maxCount * this.unitWidth);
    }
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
        // x1: rect.x1,
      });
      return preTotalHeight + timeline.height;
    }, 0);

    this.group.setAttributes({
      x: rect.x1,
      y: rect.y1,
      width: rect.width,
      height: totalHeight,
    });
  }

  compile() {
    this.timelines.forEach((v) => {
      v.compile(this.group);
    });
    this.stage.defaultLayer.add(this.group);
  }
}
