import { LayoutRect, TaskOption } from "../../../types/core";
import { IGraphic } from "@visactor/vrender";
import { TaskData } from "../../data/task";
import { Chart } from "..";
import { BarWidget } from "../../widgets/bar";
import { BaseWidget } from "../../widgets/base";

export interface TaskConfig extends TaskOption {
  height?: number;
  index: number;
}

export class Task {
  data: TaskData;
  marks: BaseWidget[] = [];
  barWidget!: BarWidget;
  chart: Chart;
  height: number = 50;
  rect: LayoutRect = {
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0,
    width: 0,
    height: 0,
    offsetX: 0,
    offsetY: 0,
  };
  constructor(data: TaskData, chart: Chart) {
    this.data = data;
    this.chart = chart;
    this.init();
  }

  private init() {
    this.initWidget();
  }

  private initWidget() {
    this.barWidget = new BarWidget({ data: this.data });
  }

  private getRect() {
    const timeScale = this.chart.getTimeScale();
    const range = [
      timeScale.getValue(this.data.startTime),
      timeScale.getValue(this.data.endTime),
    ];
    const rect = {
      x: range[0],
      y: this.rect.y1 + this.getRowId() * this.height,
      width: range[1] - range[0],
      height: this.height,
      offsetX: this.rect.offsetX,
      offsetY: this.rect.offsetY,
    };
    return {
      x1: rect.x,
      y1: rect.y,
      x2: rect.x + rect.width,
      y2: rect.y + rect.height,
      width: rect.width,
      height: rect.height,
      offsetX: this.rect.offsetX,
      offsetY: this.rect.offsetY,
    };
  }

  getRowId() {
    return this.data.rowId;
  }

  updateLayout(rect: LayoutRect) {
    this.rect = rect;
    this.reLayout();
  }

  reLayout() {
    this.rect = this.getRect();
    console.log(this.rect);
    this.barWidget?.relayout(this.rect);
  }

  compile(group: IGraphic) {
    this.marks.push(this.barWidget);
    this.barWidget?.compile(group);
  }

  getMarks() {
    return this.marks;
  }

  release() {
    this.marks.forEach((mark) => mark.release());
  }
}
