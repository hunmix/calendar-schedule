import { ResourceOption, TaskOption } from "../../types/core";
import { ResourceData } from "./resouce";
import { TaskData } from "./task";

export interface dataOptions {
  tasks: TaskOption;
  resources: ResourceOption[];
}

export interface DataStoreOption {
  resources?: ResourceOption[];
  tasks?: TaskOption[];
}

export class DataStore {
  resources: ResourceData[] = [];
  tasks: TaskData[] = [];
  taskMap: Map<string, TaskData> = new Map();
  resourceMap: Map<string, ResourceData> = new Map();
  option: DataStoreOption;
  constructor(option: DataStoreOption) {
    this.option = option;
    this.init();
  }

  private init() {
    const { tasks = [], resources = [] } = this.option;
    tasks.forEach((task) => this.addTask({ ...task }));
    resources.forEach((resource) => this.addResource(resource));
  }

  addTask(option: TaskOption) {
    const task = new TaskData({ ...option, index: this.tasks.length });
    this.taskMap.set(task.id, task);
    this.tasks.push(task);
  }
  addResource(option: ResourceOption) {
    const resource = new ResourceData(option);
    this.resourceMap.set(resource.id, resource);
    this.resources.push(resource);
  }

  getTasks() {
    return this.tasks;
  }

  getReources() {
    return this.resources;
  }

  getTasksByResourceId(resourceId: string) {
    return this.tasks.filter((task) => task.resourceId === resourceId);
  }
}
