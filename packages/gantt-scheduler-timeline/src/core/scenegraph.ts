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
    this.resizeEventStore.observe(container, this.resize);
  }

  initLayout() {
    this.mainGroup.setAttributes({
      x: 0,
      y: 0,
      height: this.schedule.height,
      width: this.schedule.width,
    });
    this.resouceGroup.setAttributes({
      x: 0,
      y: this.schedule.calenderTotalHeight,
      height: this.schedule.height - this.schedule.calenderTotalHeight,
      width: 70,
      fill: "red",
    });
    this.calenderGroup.setAttributes({
      x: 0,
      y: 0,
      height: this.schedule.calenderTotalHeight,
      width: this.schedule.width,
    });
    console.log(this.resouceGroup.AABBBounds);
    this.mainGroup.add(this.resouceGroup);
    this.mainGroup.add(this.chartGroup);
    this.mainGroup.add(this.calenderGroup);
    this.mainGroup.add(this.resourceHeaderGroup);
  }

  initComponents() {
    const calenderData = this.schedule.getCalenderData();
    console.log(calenderData);
    const calanederMarks: CalenderCell[] = [];
    calenderData.forEach((data) => {
      const { ticks, height, y } = data;
      ticks.forEach((tick) => {
        calanederMarks.push(
          new CalenderCell(
            {
              x: 0,
              y: y,
              width: 70,
              height: height,
            },
            tick
          )
        );
      });
    });
    calanederMarks.forEach((v) => v.append(this.calenderGroup));
  }

  resize = (entry: ResizeObserverEntry, observer: ResizeObserver) => {
    const { contentRect } = entry;
    console.log("resize");
    console.log({
      width: contentRect.width,
      height: contentRect.height,
    });
  };

  render() {
    this.stage.render();
  }

  release() {
    this.stage.release();
  }
}
