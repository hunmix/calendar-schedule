import { IGroup, Stage, createGroup } from "@visactor/vrender";
import { BaseComponent } from "../component/base";
import { DataStore } from "../data/dataStore";
import { Task } from "./task/base";
import { TimeScale } from "../timeScale";
import { GridLayout } from "../layout/gridLayout";

export class Chart extends BaseComponent {
  tasks: Task[] = [];
  dataStore!: DataStore;
  layout!: GridLayout;
  group: IGroup = createGroup({ clip: true });
  rowIndex?: number;
  colIndex?: number;
  constructor(stage: Stage, timeScale: TimeScale) {
    super(stage, timeScale);
  }

  init() {
    this.initMarks();
  }

  private initMarks() {
    const taskData = this.dataStore.getTasks();
    this.tasks = taskData.map((data) => new Task(data, this));
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
    this.tasks.forEach((task) => {
      task.updateLayout({
        ...rect,
        y1: rect.y1 + task.getRowId() * task.height,
        x1: rect.x1,
      });
    });
  }

  getTimeScale() {
    return this.timeScale;
  }

  reLayout() {
    this.updateLayout();
    this.tasks.forEach((task) => task.reLayout());
  }

  getGraphics() {
    return this.group;
  }

  compile() {
    this.tasks.forEach((task) => task.compile(this.group));
    this.stage.defaultLayer.add(this.group);
  }
}
