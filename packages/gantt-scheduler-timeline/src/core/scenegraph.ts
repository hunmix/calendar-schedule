import { Group, IGroup, Stage, createGroup } from "@visactor/vrender";
import Schedule from "./schedule";
import { ResizeEventStore } from "./resizeEventStore";
import { CalenderCell } from "./component/calenderCell";
import { GridLayout } from "./layout/gridLayout";
import { LayoutGroup } from "./component/group";
import { Scrollbar, ScrollbarEventPayload } from "./component/scrollbar";
import { ResourceHeaderCell } from "./component/resourceHeaderCell";
import { ResourceCell } from "./component/resourceCell";
import { TaskBar } from "./component/taskbar";
import { ChartColGrid } from "./component/chartColGrid";
import { ChartRowGrid } from "./component/chartRowGrid";

export class Scenegraph {
  schedule: Schedule;
  mainGroup: IGroup;
  resouceGroup: LayoutGroup;
  chartGroup: LayoutGroup;
  calenderGroup: LayoutGroup;
  resourceHeaderGroup: LayoutGroup;
  bodyScrollXGroup: LayoutGroup;
  bodyScrollYGroup: LayoutGroup;
  stage: Stage;
  layout: GridLayout;
  components: any[] = [];
  rendering: boolean = false;
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
    this.bodyScrollXGroup = new LayoutGroup();
    this.bodyScrollYGroup = new LayoutGroup();
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
      container: container,
      width: this.schedule.width,
      height: this.schedule.height,
      autoRender: false,
    });
    this.stage.defaultLayer.add(this.mainGroup);
    // this.resizeEventStore.observe(container, this.resize);
  }

  initLayout() {
    this.layout.bind({
      group: this.resourceHeaderGroup,
      colIndex: 0,
      rowIndex: 0,
    });
    this.layout.bind({ group: this.resouceGroup, colIndex: 0, rowIndex: 1 });
    this.layout.bind({ group: this.calenderGroup, colIndex: 1, rowIndex: 0 });
    this.layout.bind({ group: this.chartGroup, colIndex: 1, rowIndex: 1 });
    this.layout.bind({
      group: this.bodyScrollXGroup,
      colIndex: 1,
      rowIndex: 2,
    });
    this.layout.bind({
      group: this.bodyScrollYGroup,
      colIndex: 2,
      rowIndex: 1,
    });
    // this.layout.setRowSize(2, this.scrollbarWidth);
    this.resouceGroup.append(this.mainGroup);
    this.chartGroup.append(this.mainGroup);
    this.calenderGroup.append(this.mainGroup);
    this.resourceHeaderGroup.append(this.mainGroup);
    this.bodyScrollXGroup.append(this.mainGroup);
    this.bodyScrollYGroup.append(this.mainGroup);
    this.updateLayout();
    this.components.forEach((v) => v.resize());
  }

  updateLayout() {
    this.stage.width = this.schedule.width;
    this.stage.height = this.schedule.height;
    const scrollYWidth =
      this.schedule.bodyContentHeight > this.schedule.height
        ? this.schedule.scrollbarWidth
        : 0;
    const scrollXHeight =
      this.schedule.bodyContentWidth > this.schedule.width
        ? this.schedule.scrollbarWidth
        : 0;
    this.layout.setColSize(0, this.schedule.columnTotalWidth);
    this.layout.setColSize(
      1,
      this.schedule.width - this.schedule.columnTotalWidth - scrollYWidth
    );
    this.layout.setColSize(2, scrollYWidth);
    // this.layout.setColSize(2, this.scrollbarWidth);
    this.layout.setRowSize(0, this.schedule.calenderTotalHeight);
    this.layout.setRowSize(
      1,
      this.schedule.height - this.schedule.calenderTotalHeight - scrollXHeight
    );
    this.layout.setRowSize(2, scrollXHeight);
    this.layout.setColContentSize(1, this.schedule.bodyContentWidth);
    this.layout.setRowContentSize(1, this.schedule.bodyContentHeight);
    this.layout.reLayout();
    [
      this.resouceGroup,
      this.chartGroup,
      this.calenderGroup,
      this.resourceHeaderGroup,
      this.bodyScrollXGroup,
      this.bodyScrollYGroup,
    ].forEach((group) => group.resize());
    // TODO:
    this.mainGroup.setAttributes({
      x: 0,
      y: 0,
      height: this.schedule.height,
      width: this.schedule.width,
    });
    this.components.forEach((v) => v.resize());
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
    const timeScale = this.schedule.getTimeScale();

    const calanederMarks: CalenderCell[] = [];
    calenderData.forEach((data, rowIndex) => {
      const { ticks, height, y } = data;
      ticks.forEach((tick) => {
        const { startTime, endTime } = tick;
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

    const firstRowTicks = calenderData[0].ticks;
    const lastRowTicks = calenderData[calenderData.length - 1].ticks;
    const xPositions = [
      { data: lastRowTicks, style: { stroke: "#ccc" } },
      { data: firstRowTicks, style: { stroke: "#000" } },
    ].map((v) => {
      const positions = v.data.map((tick) =>
        timeScale.getValue(tick.startTime)
      );
      positions.shift();
      return {
        positions,
        style: v.style,
      };
    });

    const colGridMarks: ChartColGrid[] = [];

    xPositions.map(({ positions, style }) =>
      positions.map((x) => {
        const chartColGrid = new ChartColGrid(
          {
            points: [
              {
                x,
                y: 0,
              },
              {
                x,
                y: this.schedule.bodyContentHeight,
              },
            ],
          },
          style
        );
        colGridMarks.push(chartColGrid);
      })
    );
    colGridMarks.map((v: any) => v.append(this.chartGroup.getInnerGroup()));

    const scrollBarX = new Scrollbar(
      {
        direction: "horizontal",
      },
      this
    );
    const scrollBarY = new Scrollbar(
      {
        direction: "vertical",
      },
      this
    );

    const resourceHeaderMarks: ResourceHeaderCell[] = [];
    this.schedule.getResourceHeaderData().reduce((prev, current) => {
      const width = this.schedule.getResourceColWidth(current.colIndex);
      resourceHeaderMarks.push(
        new ResourceHeaderCell(
          {
            x: 0 + prev,
            y: 0,
            width,
            height: this.schedule.calenderTotalHeight,
          },
          {
            text: current.title,
          }
        )
      );
      return prev + width;
    }, 0);

    resourceHeaderMarks.forEach((v) =>
      v.append(this.resourceHeaderGroup.getInnerGroup())
    );

    this.schedule
      .getResourceData()
      .map(
        (resouceData: any) =>
          new ResourceCell(
            {
              y: resouceData.y,
              x: resouceData.x,
              width: resouceData.width,
              height: resouceData.height,
            },
            {
              text: resouceData.name,
            }
          )
      )
      .map((v: any) => v.append(this.resouceGroup.getInnerGroup()));

    this.schedule
      .getRowLineData()
      .map(
        (y) =>
          new ChartRowGrid(
            {
              points: [
                {
                  x: 0,
                  y,
                },
                {
                  x: this.schedule.bodyContentWidth,
                  y,
                },
              ],
            },
            {
              stroke: "#ccc",
            }
          )
      )
      .map((v: any) => v.append(this.chartGroup.getInnerGroup()));

    const tasks = this.schedule.getTaskData();
    tasks
      .map((task) => {
        return new TaskBar(
          {
            x: timeScale.getValue(task.startTime),
            width:
              timeScale.getValue(task.endTime) -
              timeScale.getValue(task.startTime),
            y: task.rowIndex * this.schedule.bodyRowHeight,
            height: this.schedule.bodyRowHeight,
            text: task.title,
          },
          {
            barHeight: this.schedule.taskbarHeight,
            text: task.title,
          }
        );
      })
      .map((v: any) => v.append(this.chartGroup.getInnerGroup()));

    scrollBarX.bindLayout(this.bodyScrollXGroup.layout!);
    scrollBarX.append(this.bodyScrollXGroup.getOuterGroup());
    scrollBarX.addListenser("scroll", this.handleScroll);

    scrollBarY.bindLayout(this.bodyScrollYGroup.layout!);
    scrollBarY.append(this.bodyScrollYGroup.getOuterGroup());
    scrollBarY.addListenser("scroll", this.handleScroll);
    this.components.push(scrollBarX);
    this.components.push(scrollBarY);
  }

  private handleScroll = (e: any, payload: ScrollbarEventPayload) => {
    const { offset, direction } = payload;
    if (direction === "vertical") {
      this.layout.setRowOffset(1, offset);
    } else if (direction === "horizontal") {
      this.layout.setColOffset(1, offset);
    }
    this.resize();
  };

  relayout() {}

  resize() {
    this.updateLayout();
    this.render();
  }

  render() {
    console.log("render");
    this.stage.renderNextFrame();
  }

  release() {
    this.stage.release();
  }
}
