import { IGroup, Stage, createGroup } from "@visactor/vrender";
import Schedule from "./schedule";
import { ResizeEventStore } from "./resizeEventStore";
import { CalenderCell } from "./component/calenderCell";

export class Scenegraph {
  schedule: Schedule;
  mainGroup: IGroup;
  resouceGroup: IGroup;
  chartGroup: IGroup;
  calenderGroup: IGroup;
  resourceHeaderGroup: IGroup;
  stage: Stage;
  resizeEventStore: ResizeEventStore;
  constructor(schedule: Schedule) {
    this.schedule = schedule;
    this.mainGroup = createGroup({
      clip: false,
    });
    this.resouceGroup = createGroup({
      clip: true,
    });
    this.chartGroup = createGroup({
      clip: true,
    });
    this.calenderGroup = createGroup({
      clip: true,
    });
    this.resourceHeaderGroup = createGroup({
      clip: true,
    });
    this.resizeEventStore = new ResizeEventStore();
    const container = this.schedule.getContainer();
    this.stage = new Stage({
      container: "canvas2",
      // container: container,
      width: this.schedule.width,
      height: this.schedule.height,
      autoRender: false,
    });
    this.stage.defaultLayer.add(this.mainGroup);
    // this.resizeEventStore.observe(container, this.resize);
  }

  initLayout() {
    this.updateLayout()
    this.mainGroup.add(this.resouceGroup);
    this.mainGroup.add(this.chartGroup);
    this.mainGroup.add(this.calenderGroup);
    this.mainGroup.add(this.resourceHeaderGroup);
  }

  updateLayout() {
    this.stage.width = this.schedule.width;
    this.stage.height = this.schedule.height;
    this.mainGroup.setAttributes({
      x: 0,
      y: 0,
      height: this.schedule.height,
      width: this.schedule.width,
    });
    this.chartGroup.setAttributes({
      x: 0,
      y: 0,
      height: this.schedule.height,
      width: this.schedule.width,
    });
    this.chartGroup.setAttributes({
      x: this.schedule.columnTotalWidth,
      y: this.schedule.calenderTotalHeight,
      height: this.schedule.height,
      width: this.schedule.width - this.schedule.columnTotalWidth,
    });
    this.resouceGroup.setAttributes({
      x: 0,
      y: this.schedule.calenderTotalHeight,
      height: this.schedule.height - this.schedule.calenderTotalHeight,
      width: this.schedule.columnTotalWidth,
      fill: "orange",
    });
    this.calenderGroup.setAttributes({
      x: this.schedule.columnTotalWidth,
      y: 0,
      height: this.schedule.calenderTotalHeight,
      width: this.schedule.width,
      fill: 'lightblue'
    });
  }

  initComponents() {
    const calenderData = this.schedule.getCalenderData();
    console.log(calenderData);
    const calanederMarks: CalenderCell[] = [];
    calenderData.forEach((data) => {
      const { ticks, height, y } = data;
      ticks.forEach(tick => {
        const { startTime, endTime } = tick
        const timeScale = this.schedule.getTimeScale()
        const range = [
          timeScale.getValue(startTime),
          timeScale.getValue(endTime),
        ];
        calanederMarks.push(
          new CalenderCell(
            {
              x: range[0],
              y: y,
              width: range[1] - range[0],
              height: height,
            },
            tick
          )
        );
      });
    });
    calanederMarks.forEach((v) => v.append(this.calenderGroup));
  }

  resize() {
    this.updateLayout()
    this.render()
  };

  render() {
    this.stage.render();
  }

  release() {
    this.stage.release();
  }
}
