import { LayoutItem } from "./layoutItem";

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

// TODO:
let ID = 1;

export class GridLayout {
  items: LayoutItem[] = [];
  rowsSize: number[];
  colsSize: number[];
  itemMap: Map<number, LayoutItem> = new Map();
  rows: LayoutItem[][];
  cols: LayoutItem[][];
  width: number;
  height: number;
  constructor(option: GridLayoutOption) {
    const { cols, rows, width, height } = option;
    this.rowsSize = new Array(rows).fill(0);
    this.colsSize = new Array(cols).fill(0);
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
  setRowSize(rowIndex: number, size: number) {
    this.rowsSize[rowIndex] = Math.max(size, 0);
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

  reLayout() {
    this.colsSize.reduce((totalSize, curSize, index) => {
      this.cols[index].forEach((el) => {
        el.setAttr({
          x1: totalSize,
          width: curSize,
          x2: totalSize + curSize,
        });
      });
      return curSize + totalSize;
    }, 0);
    this.rowsSize.reduce((totalSize, curSize, index) => {
      this.rows[index].forEach((el) => {
        el.setAttr({
          y1: totalSize,
          height: curSize,
          y2: totalSize + curSize,
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
