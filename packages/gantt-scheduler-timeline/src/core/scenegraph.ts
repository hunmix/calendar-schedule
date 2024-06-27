import { Group, IGroup, Stage, createGroup } from "@visactor/vrender";
import Schedule from "./schedule";
import { ResizeEventStore } from "./resizeEventStore";
import { CalenderCell } from "./component/calenderCell";
import { GridLayout } from "./layout/gridLayout";
import { LayoutGroup } from "./component/group";

export class Scenegraph {
  schedule: Schedule;
  mainGroup: IGroup;
  resouceGroup: LayoutGroup;
  chartGroup: LayoutGroup;
  calenderGroup: LayoutGroup;
  resourceHeaderGroup: LayoutGroup;
  stage: Stage;
  layout: GridLayout;
  resizeEventStore: ResizeEventStore;
  constructor(schedule: Schedule) {
    this.schedule = schedule;
    this.layout = new GridLayout({
      cols: 3,
      rows: 3,
      width: 0,
      height: 0,
    });
    this.mainGroup = createGroup({
      clip: false,
    });
    this.resouceGroup = new LayoutGroup();
    this.chartGroup = new LayoutGroup();
    this.calenderGroup = new LayoutGroup();
    this.resourceHeaderGroup = new LayoutGroup();
    // this.resouceGroup = createGroup({
    //   clip: true,
    // });
    // this.chartGroup = createGroup({
    //   clip: true,
    // });
    // this.calenderGroup = createGroup({
    //   clip: true,
    // });
    // this.resourceHeaderGroup = createGroup({
    //   clip: true,
    // });
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
    this.layout.bind({ group: this.resourceHeaderGroup, colIndex: 0, rowIndex: 0 });
    this.layout.bind({ group: this.resouceGroup, colIndex: 0, rowIndex: 1 });
    this.layout.bind({ group: this.calenderGroup, colIndex: 1, rowIndex: 0 });
    this.layout.bind({ group: this.chartGroup, colIndex: 1, rowIndex: 1 });
    // this.layout.setRowSize(2, this.scrollbarWidth);
    this.resouceGroup.append(this.mainGroup);
    this.chartGroup.append(this.mainGroup);
    this.calenderGroup.append(this.mainGroup);
    this.resourceHeaderGroup.append(this.mainGroup);
    this.updateLayout();
  }

  updateLayout() {
    this.stage.width = this.schedule.width;
    this.stage.height = this.schedule.height;
    this.layout.setColSize(0, this.schedule.columnTotalWidth);
    this.layout.setColSize(
      1,
      this.schedule.width - this.schedule.columnTotalWidth
    );
    // this.layout.setColSize(2, this.scrollbarWidth);
    this.layout.setRowSize(0, this.schedule.calenderTotalHeight);
    this.layout.setRowSize(
      1,
      this.schedule.height - this.schedule.calenderTotalHeight
    );
    this.layout.reLayout();
    [this.resouceGroup, this.chartGroup, this.calenderGroup, this.resourceHeaderGroup].forEach(group => group.resize())
    // TODO:
    this.mainGroup.setAttributes({
      x: 0,
      y: 0,
      height: this.schedule.height,
      width: this.schedule.width,
    });
    // this.chartGroup.setAttributes({
    //   x: 0,
    //   y: 0,
    //   height: this.schedule.height,
    //   width: this.schedule.width,
    // });
    // this.chartGroup.setAttributes({
    //   x: this.schedule.columnTotalWidth,
    //   y: this.schedule.calenderTotalHeight,
    //   height: this.schedule.height,
    //   width: this.schedule.width - this.schedule.columnTotalWidth,
    // });
    // this.resouceGroup.setAttributes({
    //   x: 0,
    //   y: this.schedule.calenderTotalHeight,
    //   height: this.schedule.height - this.schedule.calenderTotalHeight,
    //   width: this.schedule.columnTotalWidth,
    //   fill: "orange",
    // });
    // this.calenderGroup.setAttributes({
    //   x: this.schedule.columnTotalWidth,
    //   y: 0,
    //   height: this.schedule.calenderTotalHeight,
    //   width: this.schedule.width,
    //   fill: "lightblue",
    // });
  }

  initComponents() {
    const calenderData = this.schedule.getCalenderData();
    console.log(calenderData);
    const calanederMarks: CalenderCell[] = [];
    calenderData.forEach((data) => {
      const { ticks, height, y } = data;
      ticks.forEach((tick) => {
        const { startTime, endTime } = tick;
        const timeScale = this.schedule.getTimeScale();
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
    calanederMarks.forEach((v) => v.append(this.calenderGroup.getInnerGroup()));
  }

  relayout() {}

  resize() {
    this.updateLayout();
    this.render();
  }

  render() {
    this.stage.render();
  }

  release() {
    this.stage.release();
  }
}
