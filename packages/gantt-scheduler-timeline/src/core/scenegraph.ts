import { IGroup, createGroup } from "@visactor/vrender";
import Schedule from "./schedule";

export class Scenegraph {
  schedule: Schedule;
  resouceGroup: IGroup;
  constructor(schedule: Schedule) {
    this.schedule = schedule;
    this.resouceGroup = createGroup({
      clip: true,
    })
  }
}
