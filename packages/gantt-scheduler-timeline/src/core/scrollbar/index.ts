import { IGroup, Stage, createGroup } from "@visactor/vrender";
import { BaseComponent } from "../component/base";
import { DataStore } from "../data/dataStore";
import { Task } from "./task/base";
import { TimeScale } from "../timeScale";
import { GridLayout } from "../layout/gridLayout";
import { RectMark } from "../marks/rect";

export type ScrollDirection = "horizontal" | "vertical";

export interface ScrollbarOptions {
  direction: ScrollDirection;
}

export type TypeEventType = "scrollStart" | "scroll" | "scrollEnd";

export type ScrollBarEvent = (e: any, payload: any) => void;

export class Scrollbar extends BaseComponent {
  direction: ScrollDirection;
  scrollbar!: RectMark;
  layout!: GridLayout;
  rowIndex?: number;
  colIndex?: number;
  isDragging: boolean = false;
  start: number = 0;
  dragLength: number = 0;
  listeners: ScrollBarEvent[] = [];
  listenerMap: Map<TypeEventType, ScrollBarEvent[]> = new Map();
  constructor(options: ScrollbarOptions, stage: Stage, timeScale: TimeScale) {
    super(stage, timeScale);
    this.direction = options.direction;
    this.listenerMap.set("scrollStart", []);
    this.listenerMap.set("scroll", []);
    this.listenerMap.set("scrollEnd", []);
  }

  init() {
    this.initMarks();
  }

  private initMarks() {
    this.scrollbar = new RectMark({
      fill: "red",
      opacity: 0.5,
    });
    this.scrollbar.getGraphic()?.addEventListener("mousedown", (v: any) => {
      const rect = this.getLayoutRect();
      console.log("start");
      console.log(rect.offsetY);
      this.dragLength =
        this.direction === "vertical" ? rect.offsetY : rect.offsetX;
      this.isDragging = true;
      this.start = this.direction === "vertical" ? v.canvas.y : v.canvas.x;
      // console.log(v);
    });
    this.scrollbar.getGraphic()?.addEventListener("mousemove", (v: any) => {
      if (this.isDragging) {
        this.dragLength =
          (this.direction === "vertical" ? v.canvas.y : v.canvas.x) -
          this.start;
        this.trigger("scroll", v, this.dragLength);
      }
    });
    this.scrollbar.getGraphic()?.addEventListener("mouseup", (v) => {
      this.isDragging = false;
      this.dragLength = 0;
      console.log("mouseup");
      // console.log(v);
    });
  }

  getTimeScale() {
    return this.timeScale;
  }

  addListenser(type: TypeEventType, event: ScrollBarEvent) {
    if (!this.listenerMap.has(type)) {
      throw Error(`${type} is invalid in scroll event types`);
    }
    this.listenerMap.get(type)!.push(event);
  }

  trigger(type: TypeEventType, e: Event, payload: any) {
    const listeners = this.listenerMap.get(type) || [];
    // listeners.forEach(listener => listener.call(null, e, payload))
    listeners.forEach((listener) => listener(e, payload));
  }

  reLayout() {
    const rect = this.getLayoutRect();
    if (this.direction === "horizontal") {
      const barLength = (rect.width / rect.contentWidth) * rect.width;
      const start =
        rect.x1 + (Math.abs(rect.offsetX) / rect.contentWidth) * rect.width;
      console.log(rect.y1 + rect.offsetY);
      this.scrollbar.update({
        x: start,
        y: rect.y1 + rect.offsetY,
        width: barLength,
        height: rect.height,
      });
    } else {
      const barLength = (rect.height / rect.contentHeight) * rect.height;
      const start =
        rect.y1 + (Math.abs(rect.offsetY) / rect.contentHeight) * rect.height;
      this.scrollbar.update({
        x: rect.x1,
        y: start,
        width: rect.width,
        height: barLength,
      });
    }
  }

  getGraphics() {
    return this.group;
  }

  compile() {
    this.scrollbar.compile(this.group);
    this.stage.defaultLayer.add(this.group);
  }
}
