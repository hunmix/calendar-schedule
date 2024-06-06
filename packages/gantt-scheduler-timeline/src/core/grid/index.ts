import { IGroup, Stage, createGroup } from "@visactor/vrender";
import { BaseComponent } from "../component/base";
import { DataStore } from "../data/dataStore";
import { TimeScale } from "../timeScale";
import { GridLayout } from "../layout/gridLayout";
import { GridColumn } from "./column";
import { Column as ColumnOption } from "../../types/core";

export interface GridOption {
  columns: ColumnOption[];
}

export class Grid extends BaseComponent {
  columns: GridColumn[] = [];
  group: IGroup = createGroup({});
  layout!: GridLayout;
  rowIndex?: number;
  colIndex?: number;
  option: GridOption;
  height: number = 50;
  constructor(option: GridOption, stage: Stage, timeScale: TimeScale) {
    super(stage, timeScale);
    this.option = option;
  }

  init() {
    const resourceData = this.dataStore.getReources();
    this.columns = this.option.columns.map((col) => {
      const column = new GridColumn(
        {
          resources: resourceData,
          field: col.field,
          width: col.width,
        },
        this.stage
      );
      return column;
    });

    // TODO:
    const contentHeight = resourceData.length * this.height
    this.layout.setRowContentSize(this.rowIndex!, contentHeight);
  }

  reLayout() {
    const rect = this.getLayoutRect();
    console.log(this.layout)
    let x1 = 0;
    this.columns.forEach((column) => {
      column.reLayout({
        ...rect,
        x1: rect.x1 + x1,
        x2: rect.x1 + x1 + column.width,
        y1: rect.y1,
        width: column.width!,
      });
      x1 += column.width!;
    });
  }

  getGraphic() {
    return this.group;
  }

  compile() {
    this.columns.forEach((column) => column.compile(this.group));
    this.stage.defaultLayer.add(this.group);
  }
}
