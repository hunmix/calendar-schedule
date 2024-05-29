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
    resources.forEach((resource, index) =>
      this.addResource({ ...resource, rowId: index })
    );
    tasks.forEach((task) =>
      this.addTask({
        ...task,
        rowId: this.getRowIdByResourceId(task.resourceId),
      })
    );
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

  getRowIdByResourceId(id: string) {
    const resource = this.resourceMap.get(id);

    if (resource) {
      return resource.rowId;
    }
    throw new Error(`resource id ${id} not found`);
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
