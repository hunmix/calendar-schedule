import { IGroup, Stage, createGroup } from "@visactor/vrender";
import { BaseComponent } from "../component/base";
import { DataStore } from "../data/dataStore";
import { Task } from "./task/base";
import { TimeScale } from "../timeScale";
import { GridLayout } from "../layout/gridLayout";
import { RectMark } from "../marks/rect";

export class Chart extends BaseComponent {
  tasks: Task[] = [];
  cells: RectMark[] = [];
  lines: RectMark[] = [];
  dataStore!: DataStore;
  layout!: GridLayout;
  group: IGroup = createGroup({ clip: true });
  innerGroup: IGroup = createGroup({});
  rowIndex?: number;
  colIndex?: number;
  constructor(stage: Stage, timeScale: TimeScale) {
    super(stage, timeScale);
    this.group.add(this.innerGroup);
  }

  init() {
    this.initMarks();
  }

  private initMarks() {
    const rect = this.getLayoutRect();
    const taskData = this.dataStore.getTasks();
    this.tasks = taskData.map((data) => new Task(data, this));
    const ticks = this.schedule.getTicks();
    this.cells = ticks.map(({ startTime, endTime, text }) => {
      const range = [
        this.timeScale.getValue(startTime),
        this.timeScale.getValue(endTime),
      ];

      return new RectMark({
        x: range[0],
        y: 0,
        width: range[1] - range[0],
        height: rect.contentHeight,
        stroke: "#ccc",
        fillOpacity: 0.5,
      });
    });
    this.lines = this.dataStore.getReources().map((resourceData, index) => {

      return new RectMark({
        x: 0,
        y: 0 + 50 * index,
        width: rect.contentWidth,
        height: 50,
        stroke: "#ccc",
        fillOpacity: 0.5,
      });
    });
  }

  protected updateLayout() {
    const rect = this.getLayoutRect();
    this.group.setAttributes({
      // x: rect.x1 - rect.offsetX,
      // y: rect.y1 - rect.offsetY,
      x: rect.x1,
      y: rect.y1,
      width: rect.width,
      height: rect.height,
    });
    this.innerGroup.setAttributes({
      // x: rect.x1 - rect.offsetX,
      // y: rect.y1 - rect.offsetY,
      x: rect.offsetX,
      y: rect.offsetY,
      width: rect.contentWidth || rect.width,
      height: rect.contentHeight || rect.height,
    });
    this.tasks.forEach((task) => {
      task.updateLayout(rect);
    });
    this.relayoutTicks();
    this.relayoutLines();
  }

  getTimeScale() {
    return this.timeScale;
  }

  relayoutTicks() {
    const rect = this.getLayoutRect();
    const ticks = this.schedule.getTicks();
    ticks.forEach(({ startTime, endTime, text }, index) => {
      const range = [
        this.timeScale.getValue(startTime),
        this.timeScale.getValue(endTime),
      ];

      this.cells[index].update({
        x: range[0],
        width: range[1] - range[0],
        height: rect.contentHeight,
      });
    });
  }

  relayoutLines () {
    const rect = this.getLayoutRect();
    this.lines.forEach((line) => {
      line.update({
        x: 0,
        width: rect.contentWidth,
      });
    });
  }

  reLayout() {
    this.updateLayout();
    this.tasks.forEach((task) => task.reLayout());
    this.relayoutTicks();
  }

  getGraphics() {
    return this.group;
  }

  compile() {
    this.cells.forEach((v) => v.compile(this.innerGroup));
    this.lines.forEach((v) => v.compile(this.innerGroup));
    this.tasks.forEach((task) => task.compile(this.innerGroup));
    this.stage.defaultLayer.add(this.group);
  }
}
