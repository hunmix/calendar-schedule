import { IGroup, Stage, createGroup } from "@visactor/vrender";
import { BaseComponent } from "../component/base";
import { DataStore } from "../data/dataStore";
import { Task } from "./task/base";
import { throttle } from "lodash-es";
import { TimeScale } from "../timeScale";
import { GridLayout } from "../layout/gridLayout";
import { RectMark } from "../marks/rect";

export type ScrollDirection = "horizontal" | "vertical";

export interface ScrollbarOptions {
  direction: ScrollDirection;
}

export type TypeEventType = "scrollStart" | "scroll" | "scrollEnd";

export interface ScrollbarEventPayload {
  offset: number;
  direction: ScrollDirection;
}

export type ScrollBarEvent = (e: any, payload: ScrollbarEventPayload) => void;

export class Scrollbar extends BaseComponent {
  direction: ScrollDirection;
  scrollbar!: RectMark;
  barContainer!: RectMark;
  layout!: GridLayout;
  rowIndex?: number;
  colIndex?: number;
  isDragging: boolean = false;
  position: number = 0;
  barLength: number = 0;
  prevPosition: number = 0;
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
      fill: "rgb(168,168,168)",
      opacity: 0.5,
      cornerRadius: 5,
    });
    this.barContainer = new RectMark({
      // stroke: "#212121",
      fill: "#fafafa",
      opacity: 1,
    });

    this.initScrollEvents();
  }

  private initScrollEvents() {
    this.scrollbar.getGraphic()?.addEventListener("mousedown", (e: any) => {
      this.isDragging = true;
      this.prevPosition = this.direction === "vertical" ? e.clientY : e.clientX;
    });
    this.schedule.getChart().group.addEventListener("wheel", this.wheel);
    document.addEventListener("mousemove", this.scrollMouseMove);
    document.addEventListener("mouseup", this.scrollMouseUp);
  }

  private wheel = throttle((e: any) => {
    const { nativeEvent } = e;
    nativeEvent.preventDefault();
    nativeEvent.stopPropagation();
 
    const dragedLength = this.direction === 'horizontal'? nativeEvent.deltaX : nativeEvent.deltaY;
    this.prevPosition += dragedLength;

    this.updateScrollPosition(e, this.direction, dragedLength);
  }, 30);

  private scrollMouseUp = () => {
    this.isDragging = false;
  };

  private scrollMouseMove = throttle((e: any) => {
    if (this.isDragging) {
      const curPos = this.direction === "vertical" ? e.clientY : e.clientX;
      const dragedLength = curPos - this.prevPosition;
      this.prevPosition = curPos;

      this.updateScrollPosition(e, this.direction, dragedLength);
    }
  }, 30);

  private updateScrollPosition(
    e: any,
    direction: ScrollDirection,
    dragedLength: number
  ) {
    const rect = this.getLayoutRect();
    const rectLength = this.direction === "vertical" ? rect.height : rect.width;
    const contentLength =
      this.direction === "vertical" ? rect.contentHeight : rect.contentWidth;

    const curScrollLength = this.position + dragedLength;
    const scrollLength = Math.min(
      Math.max(curScrollLength, 0),
      rectLength - this.barLength
    );
    const offset = (scrollLength / rectLength) * contentLength;
    this.position = scrollLength;

    this.trigger("scroll", e, {
      offset: -offset,
      scrollLength,
      direction,
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
    this.group.setAttributes({
      // x: rect.x1 - rect.offsetX,
      // y: rect.y1 - rect.offsetY,
      x: rect.x1,
      y: rect.y1,
      width: rect.width,
      height: rect.height,
    });
    this.barContainer.update({
      x: 0,
      y: 0,
      width: rect.width,
      height: rect.height,
    });
    if (this.direction === "horizontal") {
      this.barLength = (rect.width / rect.contentWidth) * rect.width;
      this.group.setAttributes({
        visibleAll: this.barLength < rect.width,
      });
      this.scrollbar.update({
        x: this.position,
        y: 0,
        width: this.barLength,
        height: rect.height,
      });
    } else {
      this.barLength = (rect.height / rect.contentHeight) * rect.height;
      // TODO:
      this.group.setAttributes({
        visibleAll: this.barLength < rect.height,
      });
      this.scrollbar.update({
        x: 0,
        y: this.position,
        width: rect.width,
        height: this.barLength,
      });
    }
  }

  getGraphics() {
    return this.group;
  }

  compile() {
    this.barContainer.compile(this.group);
    this.scrollbar.compile(this.group);
    this.stage.defaultLayer.add(this.group);
  }

  release() {
    super.release();
    this.scrollbar.getGraphic()?.removeAllListeners("mousedown");
    document.removeEventListener("mousemove", this.scrollMouseMove);
    document.removeEventListener("mouseup", this.scrollMouseUp);
    document.removeEventListener("wheel", this.wheel);
  }
}
