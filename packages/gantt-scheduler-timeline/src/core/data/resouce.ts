import dayjs, { Dayjs } from "dayjs";
import { FormatMethod, ResourceOption, TaskOption } from "../../types/core";
import { IRect, Stage, createRect } from "@visactor/vrender";
import { TimeScale } from "../timeScale";

export class ResourceData {
  id: string;
  field: string;
  startDate: Dayjs;
  endDate: Dayjs;
  startTime: number;
  endTime: number;
  formatMethod?: FormatMethod;
  originData: ResourceOption;

  constructor(option: ResourceOption) {
    const { id, field, formatMethod, start, end } = option;
    this.id = id;
    this.field = field;
    this.startDate = dayjs(start);
    this.endDate = dayjs(end);
    this.startTime = this.startDate.valueOf();
    this.endTime = this.endDate.valueOf();
    this.originData = option;
    this.formatMethod = formatMethod;
  }

  getTitle() {
    const title = this.originData[this.field];
    return this.formatMethod
      ? this.formatMethod(title, this.originData, this.field)
      : title;
  }
}
