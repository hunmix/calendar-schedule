import { IGroup, Stage, createGroup } from "@visactor/vrender";
import { BaseComponent } from "../component/base";
import { DataStore } from "../data/dataStore";
import { Task } from "./task/base";
import { TimeScale } from "../timeScale";
import { GridLayout } from "../layout/gridLayout";
import { RectMark } from "../marks/rect";

export type ScrollDirection = 'horizontal' | 'vertical';

export interface ScrollbarOptions {
  direction: ScrollDirection;
}

export class Scrollbar extends BaseComponent {
  direction: ScrollDirection;
  scrollbar!: RectMark;
  layout!: GridLayout;
  rowIndex?: number;
  colIndex?: number;
  constructor(options: ScrollbarOptions, stage: Stage, timeScale: TimeScale) {
    super(stage, timeScale);
    this.direction = options.direction;
  }

  init() {
    this.initMarks();
  }

  private initMarks() {
    this.scrollbar = new RectMark({
      fill: '#000000',
      opacity: 0.5,
    })
  }

  getTimeScale() {
    return this.timeScale;
  }

  reLayout() {
    const rect = this.getLayoutRect()
    this.scrollbar.update(rect)
  }

  getGraphics() {
    return this.group;
  }

  compile() {
    this.scrollbar.compile(this.group)
    this.stage.defaultLayer.add(this.group);
  }
}
