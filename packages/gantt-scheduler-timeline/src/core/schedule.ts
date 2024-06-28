import { IGraphic, Stage } from "@visactor/vrender";
import dayjs, { Dayjs } from "dayjs";
import { Header, ScheduleOptions, TaskOption, Unit } from "../types/core";
import { ResizeEventStore } from "./resizeEventStore";
import { TimeScale } from "./timeScale";
import { BaseComponent } from "./component/base";
import { DataStore } from "./data/dataStore";
import { GridLayout } from "./layout/gridLayout";
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
  bodyContentWidth: number;
  bodyContentHeight: number;
  columnTotalWidth: number;
  private scenegraph: Scenegraph;
  private stage!: Stage;
  private startDate!: Dayjs;
  private endDate!: Dayjs;
  width: number = 500;
  height: number = 500;
  private autoFit: boolean = true;
  private timeScale!: TimeScale;
  private resizeEventStore: ResizeEventStore;
  private components: BaseComponent[] = [];
  private layout!: GridLayout;
  private dataStore!: DataStore;
  private calenderHeight: number = 30;
  scrollbarWidth: number = 10;
  bodyRowHeight: number = 50;
  taskbarHeight: number = 30;
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

  private initLayout() {
    this.resourceColumnWidthMap = [];
    this.rowHeightMap = new Array(this.dataStore.getReources().length).fill(
      this.bodyRowHeight
    );
    // calc ticks
    this.startDate = this.startDate.startOf(this.minUnit);
    this.endDate = this.endDate.endOf(this.minUnit);

    const { headers = [], columns = [] } = this.options;

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

    this.bodyContentWidth =
      this.calenderData[this.calenderData.length - 1].ticks.length *
      this.unitWidth;
    this.bodyContentHeight =
      this.dataStore.getReources().length * this.bodyRowHeight;
    this.columnTotalWidth = columns.reduce((prev, cur, index) => {
      this.resourceColumnWidthMap.push(cur.width);
      return prev + cur.width;
    }, 0);

    this.timeScale = new TimeScale({
      domain: [this.startDate.valueOf(), this.endDate.valueOf()],
      range: [0, this.bodyContentWidth],
    });

    this.scenegraph.initLayout();
    this.scenegraph.initComponents();
  }

  getResourceColWidth(index: number) {
    return this.resourceColumnWidthMap[index];
  }

  getOption() {
    return this.options;
  }

  getResourceData() {
    const { columns = [] } = this.options;
    const resources = this.dataStore.getReources();
    const res: any = [];
    columns.reduce((colPrev, colCurrent, index) => {
      const width = this.getResourceColWidth(index);
      resources.reduce((prev, current, rowIndex) => {
        const height = this.rowHeightMap[rowIndex];
        res.push({
          colIndex: index,
          field: colCurrent.field,
          width,
          y: prev,
          x: colPrev,
          height,
          name: current.getTitle(colCurrent.field),
          rowIndex,
        });
        return prev + height;
      }, 0);
      return colPrev + width;
    }, 0);
    return res;
  }

  getResourceHeaderData() {
    const { columns } = this.options;
    return (
      columns?.map((col, index) => ({
        colIndex: index,
        title: col.title,
        field: col.field,
        width: col.width,
      })) || []
    );
  }

  getRowLineData() {
    let y = 0;
    const lines = this.rowHeightMap.map((rowHeight) => (y += rowHeight));
    lines.pop();
    return lines;
  }

  getTaskData() {
    return this.dataStore.getTasks();
  }

  private generateTicks(options: Header) {
    let startDate = this.startDate;
    const { unit, format } = options;
    const ticks = [];
    let count = 0;
    while (startDate.isBefore(this.endDate)) {
      let endDate = startDate.endOf(unit);
      if (endDate.isAfter(this.endDate)) {
        endDate = this.endDate;
      }
      ticks.push({
        startTime: startDate.valueOf(),
        endTime: endDate.valueOf(),
        text: startDate.format(format ?? "YYYY-MM-DD"),
        // unitWidth: this.unitWidth,
        value: startDate.valueOf(),
      });
      count += 1;
      startDate = startDate.add(1, unit).startOf(unit);
    }
    return ticks;
  }

  getCalenderData() {
    return this.calenderData;
  }

  getTimeScale() {
    return this.timeScale;
  }

  private init() {
    this.initData();
    this.initLayout();
    this.resizeEventStore.observe(this.container, this.resize);
  }

  private resize = (entry: ResizeObserverEntry, observer: ResizeObserver) => {
    const { contentRect } = entry;
    if (
      this.width === contentRect?.width &&
      this.height === contentRect?.height
    ) {
      return;
    }
    this.width = contentRect?.width ?? this.width;
    this.height = contentRect?.height ?? this.height;
    this.scenegraph.resize();
  };

  private initData() {
    this.dataStore = new DataStore({
      tasks: this.options.tasks,
      resources: this.options.resources,
    });
  }

  getContainer() {
    return this.container;
  }

  scale(timeStamp: number) {
    return this.timeScale.getValue(timeStamp);
  }

  render() {
    this.scenegraph.render();
  }

  release() {
    // this.components.forEach((v) => v.release());
    // this.stage.release();
    this.scenegraph.release();
    this.resizeEventStore.release();
  }
}

export default Schedule;
