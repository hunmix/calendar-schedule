import { IGraphic, Stage } from "@visactor/vrender";
import dayjs, { Dayjs } from "dayjs";
import { Header, ScheduleOptions, TaskOption, Unit } from "../types/core";
import { ResizeEventStore } from "./resizeEventStore";
import { TimeScale } from "./timeScale";
import { Calender } from "./calender";
import { Chart } from "./chart";
import { BaseComponent } from "./component/base";
import { DataStore } from "./data/dataStore";
import { GridLayout } from "./layout/gridLayout";
import { Grid } from "./grid";
import { Header as GridHeader } from "./gridHeader";
import { Scrollbar, ScrollbarEventPayload } from "./scrollbar";
import { isNil } from "lodash-es";
import { LinkedList } from "./utils/linkedList";
import { Scenegraph } from "./scenegraph";

export interface Tick {
  text: string;
  startTime: number;
  endTime: number;
  value: number;
  // x1: number;
  // x2: number;
}

export interface CalenderData {
  ticks: Tick[];
  rowIndex: number;
  height: number;
  y: number;
}

class Schedule {
  private container: HTMLElement;
  private options: ScheduleOptions;
  private headerRowHeightMap: Map<number, number> = new Map();
  private bodyRowHeightMap: Map<number, number> = new Map();
  private bodyColWidthMap: Map<number, number> = new Map();
  private resourceColumnWidthMap: number[] = [];
  private calenderRowHeightMap: number[] = [];
  private rowHeightMap: number[] = [];
  private resourceRowHeightMap: LinkedList<number> = new LinkedList();
  private calenderData: CalenderData[] = [];
  calenderTotalHeight: number;
  private scenegraph: Scenegraph;
  private stage!: Stage;
  private startDate!: Dayjs;
  private endDate!: Dayjs;
  private chart!: Chart;
  private calender!: Calender;
  private grid!: Grid;
  private header!: GridHeader;
  width: number = 500;
  height: number = 500;
  private autoFit: boolean = true;
  private timeScale!: TimeScale;
  private resizeEventStore: ResizeEventStore;
  private components: BaseComponent[] = [];
  private layout!: GridLayout;
  private dataStore!: DataStore;
  private calenderHeight: number = 30;
  private scrollbarWidth: number = 10;
  private bodyRowHeight: number = 50;
  private unitWidth: number = 30;
  private autoUnitWidth: boolean = false;
  private minUnit: Unit = "day";
  private scrollX?: Scrollbar;
  private scrollY?: Scrollbar;
  constructor(container: string | HTMLElement, options: ScheduleOptions = {}) {
    const containerDom =
      typeof container === "string"
        ? document.getElementById(container)
        : container;
    if (!containerDom) {
      throw Error("container is not exist");
    }
    this.container = containerDom;

    this.options = options;
    this.resizeEventStore = new ResizeEventStore();
    const {
      tasks = [],
      startDate,
      endDate,
      autoFit,
      headers,
      unitWidth,
      autoUnitWidth,
    } = this.options;
    this.startDate = dayjs(startDate);
    this.endDate = dayjs(endDate);
    this.autoFit = !!autoFit;

    const rect = this.container.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    !isNil(unitWidth) && (this.unitWidth = unitWidth);
    !isNil(autoUnitWidth) && (this.autoUnitWidth = autoUnitWidth);

    this.minUnit = headers ? headers[headers.length - 1].unit : "day"; // TODO:

    this.scenegraph = new Scenegraph(this);
    this.init();
  }

  private initLayoutInfo() {
    console.log(this.options);
    console.log(this.stage.defaultLayer);
    // private headerRowHeightMap: Map<number, number> = new Map();
    // private bodyRowHeightMap: Map<number, number> = new Map();
    // private bodyColWidthMap: Map<number, number> = new Map();
    // private resourceColumnWidthMap: number[] = []
    // private calenderRowHeightMap: number[] = []
    // private resourceRowHeightMap: LinkedList<number> = new LinkedList()
    this.rowHeightMap = new Array(this.dataStore.getReources().length).fill(
      this.bodyRowHeight
    );
    console.log(this.rowHeightMap);
    // calc ticks
    this.startDate = this.startDate.startOf(this.minUnit);
    this.endDate = this.endDate.endOf(this.minUnit);

    const { headers = [] } = this.options;

    this.calenderTotalHeight = headers.reduce((height, header, index) => {
      const ticks = this.generateTicks(header);
      this.calenderData.push({
        rowIndex: index,
        height: this.calenderHeight,
        y: height,
        ticks,
      });
      return height + (header?.height ?? this.calenderHeight);
    }, 0);
    this.scenegraph.initLayout();
    this.scenegraph.initComponents();

    // this.timeScale = new TimeScale({
    //   domain: [
    //     this.startDate.startOf(this.minUnit).valueOf(),
    //     this.endDate.endOf(this.minUnit).valueOf(),
    //   ],
    //   // range: [rect.x1, rect.x2],
    //   range: [0, rect.contentWidth ?? rect.width],
    // });
  }

  private generateTicks(options: Header) {
    let startDate = this.startDate;
    const { unit, format } = options;
    const ticks = [];
    while (startDate.isBefore(this.endDate)) {
      let endDate = startDate.endOf(unit);
      if (endDate.isAfter(this.endDate)) {
        endDate = this.endDate;
      }
      ticks.push({
        startTime: startDate.valueOf(),
        endTime: endDate.valueOf(),
        text: startDate.format(format ?? "YYYY-MM-DD"),
        value: startDate.valueOf(),
      });
      startDate = startDate.add(1, unit).startOf(unit);
    }
    return ticks;
  }

  getCalenderData() {
    return this.calenderData;
  }

  private init() {
    this.initRenderer();
    this.initData();
    this.initLayoutInfo();
    this.initLayout();
    this.initTimeScale();
    this.initComponents();
    this.compile();
    this.render();
    this.resizeEventStore.observe(this.container, this.reLayout);
  }

  private initData() {
    this.dataStore = new DataStore({
      tasks: this.options.tasks,
      resources: this.options.resources,
    });
  }

  // TODO:
  private initLayout() {
    this.layout = new GridLayout({
      cols: 3,
      rows: 3,
      width: this.width,
      height: this.height,
    });
    const { columns = [], headers = [] } = this.options;
    const columnsWidth = columns.reduce(
      (width, column) => width + column.width,
      0
    );
    const calendarHeight = headers.reduce(
      (height, header) => height + (header?.height ?? this.calenderHeight),
      0
    );
    this.layout.setColSize(0, columnsWidth);
    this.layout.setColSize(1, this.width - columnsWidth - this.scrollbarWidth);
    this.layout.setColSize(2, this.scrollbarWidth);
    this.layout.setRowSize(0, calendarHeight);
    this.layout.setRowSize(
      1,
      this.height - calendarHeight - this.scrollbarWidth
    );
    this.layout.setRowSize(2, this.scrollbarWidth);
    this.layout.reLayout();
  }

  private initTimeScale() {
    const rect = this.layout.getRectByIndex({
      colIndex: 1,
      rowIndex: 1,
    });
    this.timeScale = new TimeScale({
      domain: [
        this.startDate.startOf(this.minUnit).valueOf(),
        this.endDate.endOf(this.minUnit).valueOf(),
      ],
      // range: [rect.x1, rect.x2],
      range: [0, rect.contentWidth ?? rect.width],
    });
  }

  getContainer() {
    return this.container;
  }

  getChart() {
    return this.chart;
  }

  getTicks() {
    return this.calender.getTicks();
  }

  addComponent() {}

  initComponents() {
    const { headers = [] } = this.options;
    this.chart = new Chart(this.stage, this.timeScale);
    this.calender = new Calender(
      {
        headers: headers.map((v) => ({
          ...v,
          height: v.height ? v.height : this.calenderHeight,
          autoUnitWidth: this.autoUnitWidth,
        })),
        start: this.startDate,
        end: this.endDate,
        unitWidth: this.unitWidth,
      },
      this.stage,
      this.timeScale
    );
    this.grid = new Grid(
      { columns: this.options.columns ?? [] },
      this.stage,
      this.timeScale
    );
    this.header = new GridHeader(
      { headers: this.options.columns ?? [] },
      this.stage,
      this.timeScale
    );
    this.scrollX = new Scrollbar(
      { direction: "horizontal" },
      this.stage,
      this.timeScale
    );
    this.scrollY = new Scrollbar(
      { direction: "vertical" },
      this.stage,
      this.timeScale
    );
    this.calender.setLayoutIndex({ rowIndex: 0, colIndex: 1 });
    this.grid.setLayoutIndex({ rowIndex: 1, colIndex: 0 });
    this.chart.setLayoutIndex({ rowIndex: 1, colIndex: 1 });
    this.header.setLayoutIndex({ rowIndex: 0, colIndex: 0 });
    this.scrollX.setLayoutIndex({ rowIndex: 2, colIndex: 1 });
    this.scrollY.setLayoutIndex({ rowIndex: 1, colIndex: 2 });
    this.components = [
      this.calender,
      this.header,
      this.grid,
      this.chart,
      this.scrollX,
      this.scrollY,
    ];
    this.scrollY.addListenser("scroll", this.handleScroll);
    this.scrollX.addListenser("scroll", this.handleScroll);
    this.components.forEach((component) => component.bindData(this.dataStore));
    this.components.forEach((component) => component.bindLayout(this.layout));
    this.components.forEach((component) => component.bindInstance(this));
    this.components.forEach((component) => component.init());

    const chartRect = this.layout.getRectByIndex({
      colIndex: 1,
      rowIndex: 1,
    });
    // TODO
    this.setContentSize(chartRect.width, chartRect.height);
    this.layout.reLayout();
    const rect = this.chart.getLayoutRect();
    this.timeScale.setRange([
      // rect.x1,
      0,
      this.autoUnitWidth ? rect.x2 : rect.x1 + rect.contentWidth, // TODO: layout item should to calc the contentHeight automatically
    ]);
    this.components.forEach((v) => v.reLayout());
  }

  private handleScroll = (e: any, payload: ScrollbarEventPayload) => {
    const { offset, direction } = payload;
    if (direction === "vertical") {
      this.layout.setRowOffset(this.scrollY?.rowIndex!, offset);
    } else if (direction === "horizontal") {
      this.layout.setColOffset(this.scrollX?.colIndex!, offset);
    }
    this.layout.reLayout();
    this.components.forEach((v) => v.reLayout());
    this.render();
  };

  scale(timeStamp: number) {
    return this.timeScale.getValue(timeStamp);
  }

  private compile() {
    this.components.forEach((component) => component.compile());
  }

  private initRenderer() {
    this.stage = new Stage({
      container: this.container,
      width: this.width,
      height: this.height,
      autoRender: false,
    });
  }

  private setContentSize(rectWidth: number, rectHeight: number) {
    if (this.scrollX && !this.autoUnitWidth && !isNil(this.unitWidth)) {
      this.layout.setColContentSize(
        this.scrollX?.colIndex!,
        Math.max(this.calender.count * this.unitWidth, rectWidth)
      );
    }
    if (this.scrollY) {
      const contentHeight = this.grid.count * this.grid.height;
      this.layout.setRowContentSize(
        this.grid.rowIndex!,
        Math.max(contentHeight, rectHeight)
      );
    }
  }

  private reLayout = (entry: ResizeObserverEntry, observer: ResizeObserver) => {
    const { contentRect } = entry;
    if (
      this.width === contentRect?.width &&
      this.height === contentRect?.height
    ) {
      return;
    }
    if (this.autoFit) {
      this.width = contentRect?.width ?? this.width;
      this.height = contentRect?.height ?? this.height;
    }
    this.stage.width = this.width;
    this.stage.height = this.height;
    this.layout.setSize(this.width, this.height);
    const leftRect = this.layout.getRectByIndex({
      rowIndex: 0,
      colIndex: 0,
    });
    const chartWidth = this.width - leftRect.width - this.scrollbarWidth;
    const chartHeight = this.height - leftRect.height - this.scrollbarWidth;
    this.layout.setColSize(1, chartWidth);
    this.layout.setRowSize(1, chartHeight);

    this.setContentSize(chartWidth, chartHeight);
    this.layout.reLayout();
    const rect = this.chart.getLayoutRect();
    this.timeScale.setRange([
      // rect.x1,
      0,
      rect.contentWidth,
      // this.autoUnitWidth ? rect.x2 : rect.x1 + rect.contentWidth,
    ]);
    this.components.forEach((v) => v.reLayout());
    this.render();
  };

  addGraphics(graphic: IGraphic) {
    this.stage.defaultLayer.add(graphic);
  }

  render() {
    this.stage.render();
    this.scenegraph.render();
    console.log("render");
  }

  release() {
    this.components.forEach((v) => v.release());
    this.stage.release();
    this.scenegraph.release();
    this.resizeEventStore.release();
  }
}

export default Schedule;
