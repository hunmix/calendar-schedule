import dayjs, { Dayjs } from "dayjs";
import { FormatMethod, ResourceOption, TaskOption } from "../../types/core";
import { IRect, Stage, createRect } from "@visactor/vrender";
import { TimeScale } from "../timeScale";

export interface TaskDataOption extends TaskOption {
  index: number;
}

export class TaskData {
  id: string;
  title: string;
  resourceId?: string;
  index: number;
  startDate: Dayjs;
  endDate: Dayjs;
  startTime: number;
  endTime: number;
  formatMethod?: FormatMethod;
  originData: TaskOption;

  constructor(option: TaskDataOption) {
    const { id, title, start, end, resourceId, index } = option;
    this.id = id;
    this.resourceId = resourceId;
    this.title = title;
    this.index = index;
    this.startDate = dayjs(start);
    this.endDate = dayjs(end);
    this.startTime = this.startDate.valueOf();
    this.endTime = this.endDate.valueOf();
    this.originData = option;
  }
}
