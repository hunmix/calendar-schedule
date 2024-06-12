import { IGroup, Stage, createGroup } from "@visactor/vrender";
import { DataStore } from "../data/dataStore";
import { GridLayout } from "../layout/gridLayout";
import { TimeScale } from "../timeScale";
import Schedule from "../schedule";

export abstract class BaseComponent {
  dataStore!: DataStore;
  layout!: GridLayout;
  stage: Stage;
  timeScale: TimeScale;
  schedule!: Schedule;
  group: IGroup = createGroup({});
  rowIndex?: number;
  colIndex?: number;
  constructor(stage: Stage, timeScale: TimeScale) {
    this.stage = stage;
    this.timeScale = timeScale;
  }

  init() {}

  protected updateLayout() {}

  bindLayout(layout: GridLayout) {
    this.layout = layout;
  }

  bindInstance(schedule: Schedule) {
    this.schedule = schedule;
  }

  bindData(dataStore: DataStore) {
    this.dataStore = dataStore;
  }

  getTimeScale() {
    return this.timeScale;
  }

  setLayoutIndex({
    rowIndex,
    colIndex,
  }: {
    rowIndex: number;
    colIndex: number;
  }) {
    this.rowIndex = rowIndex;
    this.colIndex = colIndex;
  }

  getLayoutRect() {
    if (this.colIndex === undefined || this.rowIndex === undefined) {
      throw Error("layout index no exist");
    }
    return this.layout.getRectByIndex({
      colIndex: this.colIndex,
      rowIndex: this.rowIndex,
    });
  }

  compile() {}

  reLayout() {}

  release() {}
}
