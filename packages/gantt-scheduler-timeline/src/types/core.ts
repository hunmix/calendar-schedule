import { ScrollDirection } from "../core/scrollbar";

export interface ScheduleOptions {
  tasks?: TaskOption[];
  resources?: ResourceOption[];
  startDate?: string;
  endDate?: string;
  columnWidth?: number;
  width?: number;
  height?: number;
  autoFit?: boolean;
  columns?: Column[];
  headers?: Header[];
}
export interface TaskOption {
  id: string;
  resourceId: string;
  title: string;
  data?: any;
  start: string;
  end?: string;
  duration?: number;
  [field: string]: any;
}

export interface scrollbar {
  direction: ScrollDirection;
  visible: boolean;
  barWidth: number;
}

export type FormatMethod = (
  title: string,
  data: ResourceOption,
  field: string
) => {};
export interface ResourceOption {
  id: string;
  [field: string]: any;
  formatMethod?: FormatMethod;
}

export interface Column {
  title: string;
  width: number;
  field: string;
}

export type Unit = "year" | "month" | "day" | "minute" | "second";

export interface Header {
  unit: Unit;
  height?: number;
  step?: number;
  format?: string;
}

export interface Link {
  id: "222";
  source: "2";
  target: "1";
  type: "1";
}

export interface LayoutRect {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  height: number;
}

// {
//   "project"      : {
//       "calendar"  : "general",
//       "startDate" : "2023-04-17"
//   },
//   "calendars" : {
//       ...
//   },
//   "resources"    : {
//       ...
//   },
//   "tasks"        : {
//       "rows" : [
//           {
//               "id"       : 100,
//               "name"     : "Project",
//               "expanded" : true,
//               "children" : [
//                   { "id" : 1, "duration" : 5, "name" : "Kickoff" },
//                   ...
//               ]
//           }
//       ]
//   },
//   "assignments"  : {
//       ...
//   },
//   "dependencies" : {
//       ...
//   }
// }

// headers : [
//   // Week 16 ... on the top level
//   {
//       unit       : 'week',
//       dateFormat : 'Wp'
//   },
//   // M, T, W ... on the bottom level
//   {
//       unit       : 'day',
//       dateFormat : 'd1'
//   }
// ]
