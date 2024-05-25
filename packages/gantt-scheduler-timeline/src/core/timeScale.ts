import { Dayjs } from "dayjs";
import { Unit } from "../types/core";

export interface TimeScaleConfig {
  domain: number[];
  range: number[];
  offset?: number;
}

export class TimeScale {
  domain: number[] = [];
  range: number[];
  offset: number = 0;
  constructor(config: TimeScaleConfig) {
    const { domain, range } = config;
    this.range = range;
    this.domain = domain;
  }

  setDoamin(domain: number[]) {
    this.domain = domain;
  }

  setRange(range: number[]) {
    this.range = range;
  }

  getDomain() {
    return this.domain;
  }

  getRange() {
    return this.range;
  }

  setOffset(offset: number) {
    this.offset = offset;
  }

  getValue(val: number) {
    const range = this.getRange();
    return (
      range[0] +
      ((val - this.domain[0]) / (this.domain[1] - this.domain[0])) *
        (range[1] - range[0])
    );
  }
}
