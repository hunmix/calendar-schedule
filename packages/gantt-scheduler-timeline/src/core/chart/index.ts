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
    this.innerGroup.setAttributes({
      // x: rect.x1 - rect.offsetX,
      // y: rect.y1 - rect.offsetY,
      x: rect.offsetX,
      y: rect.offsetY,
      width: rect.width,
      height: rect.height,
    });
    this.tasks.forEach((task) => {
      task.updateLayout(rect);
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
    this.tasks.forEach((task) => task.compile(this.innerGroup));
    this.stage.defaultLayer.add(this.group);
  }
}
