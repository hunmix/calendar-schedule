export interface ScheduleOptions {
  tasks?: Task[];
  start?: string;
  end?: string;
}
export interface Task {
  id: string;
  name: string;
  data: any;
  start: string;
  end: string;
}
