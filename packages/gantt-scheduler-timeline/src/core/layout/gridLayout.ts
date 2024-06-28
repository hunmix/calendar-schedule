import { Group } from "@visactor/vrender";
import { LayoutItem } from "./layoutItem";
import { LayoutGroup } from "../component/group";

export interface GridLayoutOption {
  cols: number;
  rows: number;
  width: number;
  height: number;
}

export interface LayoutInfo {
  width?: number;
  height?: number;
}
export interface LayoutIndex {
  rowIndex: number;
  colIndex: number;
}

export class GridLayout {
  items: LayoutItem[] = [];
  rowsSize: number[];
  rowsContentSize: number[];
  colsSize: number[];
  colsContentSize: number[];
  itemMap: Map<number, LayoutItem> = new Map();
  rows: LayoutItem[][];
  cols: LayoutItem[][];
  width: number;
  height: number;
  constructor(option: GridLayoutOption) {
    const { cols, rows, width, height } = option;
    this.rowsSize = new Array(rows).fill(0);
    this.rowsContentSize = new Array(rows).fill(0);
    this.colsSize = new Array(cols).fill(0);
    this.colsContentSize = new Array(cols).fill(0);
    this.rows = new Array(rows).fill(null).map(() => []);
    this.cols = new Array(cols).fill(null).map(() => []);
    this.cols.forEach((colArr, index) => {
      this.rowsSize.forEach(() => {
        colArr.push(new LayoutItem());
      });
    });
    this.rows.forEach((rowArr, index) => {
      this.colsSize.forEach((col, colIndex) => {
        rowArr.push(this.cols[colIndex][index]);
      });
    });
    this.width = width;
    this.height = height;
  }

  insertRow() {}
  insertCol() {}

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
  setColSize(colIndex: number, size: number) {
    this.colsSize[colIndex] = Math.max(size, 0);
  }
  setColContentSize(colIndex: number, size: number) {
    this.colsContentSize[colIndex] = Math.max(size, 0);
  }
  setRowSize(rowIndex: number, size: number) {
    this.rowsSize[rowIndex] = Math.max(size, 0);
  }
  setRowContentSize(rowIndex: number, size: number) {
    this.rowsContentSize[rowIndex] = Math.max(size, 0);
  }

  setRowOffset(rowIndex: number, offset: number) {
    this.rows[rowIndex].forEach((layoutItem) =>
      layoutItem.setOffset("y", offset)
    );
  }

  setColOffset(rowIndex: number, offset: number) {
    this.cols[rowIndex].forEach((layoutItem) =>
      layoutItem.setOffset("x", offset)
    );
  }

  getColItems(colIndex: number) {
    return this.cols[colIndex];
  }

  getRowItems(rowIndex: number) {
    return this.rows[rowIndex];
  }

  getRectByIndex(option: LayoutIndex) {
    const { rowIndex, colIndex } = option;
    // const x1 = this.colsSize
    //   .filter((v, i) => i <= colIndex)
    //   .reduce((pre, cur) => pre + cur, 0);
    // const y1 = this.rowsSize
    //   .filter((v, i) => i <= rowIndex)
    //   .reduce((pre, cur) => pre + cur, 0);
    // const width = this.colsSize[colIndex];
    // const height = this.rowsSize[rowIndex];
    // const x2 = x1 + width;
    // const y2 = y1 + height;
    // return {
    //   x1,
    //   x2,
    //   y1,
    //   y2,
    //   width,
    //   height,
    // };
    const layoutItem = this.rows[rowIndex][colIndex];
    return layoutItem.getRect();
  }

  getRowSize(index: number) {
    return this.rowsSize[index];
  }
  getColSize(index: number) {
    return this.colsSize[index];
  }

  bind(option: { colIndex: number, rowIndex: number, group: LayoutGroup }) {
    const { rowIndex, colIndex, group } = option;
    const layoutItem = this.rows[rowIndex][colIndex];
    layoutItem.bind(group)
    // TODO:
    group.bindLayout(layoutItem)
  }

  getLayoutItemByIndex(option: { colIndex: number, rowIndex: number }) {
    const { rowIndex, colIndex } = option;
    return this.rows[rowIndex][colIndex];
  }

  reLayout() {
    this.colsSize.reduce((totalSize, curSize, index) => {
      const colContentSize = this.colsContentSize[index];
      this.cols[index].forEach((el) => {
        el.setAttr({
          x1: totalSize,
          width: curSize,
          x2: totalSize + curSize,
          contentWidth: colContentSize,
        });
      });
      return curSize + totalSize;
    }, 0);
    this.rowsSize.reduce((totalSize, curSize, index) => {
      const rowContentSize = this.rowsContentSize[index];
      this.rows[index].forEach((el) => {
        el.setAttr({
          y1: totalSize,
          height: curSize,
          y2: totalSize + curSize,
          contentHeight: rowContentSize,
        });
        // console.log({
        //   y1: totalSize,
        //   height: curSize,
        //   y2: totalSize + curSize,
        // });
        // console.log(el);
      });
      return curSize + totalSize;
    }, 0);
  }
}
