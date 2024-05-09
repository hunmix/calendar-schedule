import { Stage, createRect } from "@visactor/vrender";
import dayjs from "dayjs";
import { ScheduleOptions, Task } from "../types/core";

class Schedule {
  private container: string | HTMLElement;
  private options: ScheduleOptions;
  private stage!: Stage;
  private tasks: Task[];

  constructor(container: string | HTMLElement, options: ScheduleOptions = {}) {
    this.container = container;
    this.options = options;
    this.tasks = [];
    this.init();
  }

  private init() {
    this.stage = new Stage({
      container: this.container,
      autoRender: true,
    });
    const { tasks = [] } = this.options;
    this.tasks = tasks;
    this.render();
  }

  render() {
    const rect = createRect({
      x: 100,
      y: 100,
      width: 20,
      height: 20,
      fill: "#144a74",
    });
    this.stage.defaultLayer.add(rect);
  }

  release() {
    this.stage.release();
  }
}

export default Schedule;
