import { IGroup, Stage, createGroup } from "@visactor/vrender";
import { BaseComponent } from "../component/base";
import { DataStore } from "../data/dataStore";
import { TimeScale } from "../timeScale";
import { GridLayout } from "../layout/gridLayout";
import { Column as ColumnOption } from "../../types/core";
import { GridHeader } from "./header";

export interface GridOption {
  headers: ColumnOption[];
}

export class Header extends BaseComponent {
  headers: GridHeader[] = [];
  group: IGroup = createGroup({});
  layout!: GridLayout;
  rowIndex?: number;
  colIndex?: number;
  option: GridOption;
  constructor(option: GridOption, stage: Stage, timeScale: TimeScale) {
    super(stage, timeScale);
    this.option = option;
  }

  init() {
    this.headers = this.option.headers.map((col) => {
      const header = new GridHeader(
        {
          title: col.title,
          width: col.width,
        },
        this.stage
      );
      return header;
    });
    this.updateLayout();
  }

  protected updateLayout() {
    const rect = this.getLayoutRect();
    let x1 = 0;
    this.headers.forEach((header) => {
      header.updateLayout({
        ...rect,
        x1: rect.x1 + x1,
        x2: rect.x1 + x1 + header.width,
        y1: rect.y1,
        width: header.width!,
      });
      x1 += header.width!;
    });
  }

  reLayout() {
    this.updateLayout();
    this.headers.forEach((header) => header.reLayout());
  }

  getGraphic() {
    return this.group;
  }

  compile() {
    this.headers.forEach((header) => header.compile(this.group));
    this.stage.defaultLayer.add(this.group);
  }
}
