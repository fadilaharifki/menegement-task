import { getTasks } from "@/api/taskApi";
import { Task } from "@/interface/TaskInterface";
import { defineStore, StoreDefinition } from "pinia";
import { v4 as uuidv4 } from "uuid";

export interface UseTaskState {
  tasks: Task[];
}

export interface UseTaskActions {
  setTask(task: Task[]): void;
  fetchTask(): Promise<void>;
  addTask(): void;
  addTaskFirstData(): void;
  updateTaskStatus(taskUUID: string, newValue: string): void;
  updateTaskPriority(taskUUID: string, newValue: string): void;
  updateTaskType(taskUUID: string, newValue: string): void;
  deleteTask(taskUUID: string): void;
  createTask(task: Task): void;
}
const createNewTask = (): Task => ({
  uuid: uuidv4(),
  title: "",
  avatar: false,
  developer: "",
  status: "",
  priority: "",
  type: "",
  estimatedSP: "",
  actualSP: "",
  isDropdownOpen: false,
  newDeveloper: "",
});

export const useTaskStore: StoreDefinition<
  "task",
  UseTaskState,
  {},
  UseTaskActions
> = defineStore("task", {
  state: (): UseTaskState => ({
    tasks: [],
  }),

  actions: {
    setTask(task) {
      this.tasks = task;
    },

    async fetchTask() {
      try {
        const data = await getTasks();
        this.tasks = data;
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      }
    },

    addTask() {
      this.tasks.push(createNewTask());
    },

    addTaskFirstData() {
      this.tasks.unshift(createNewTask());
    },

    updateTaskStatus(taskUUID, newValue) {
      const task = this.tasks.find((t: Task) => t.uuid === taskUUID);
      if (task) task.status = newValue;
    },

    updateTaskPriority(taskUUID, newValue) {
      const task = this.tasks.find((t: Task) => t.uuid === taskUUID);
      if (task) task.priority = newValue;
    },

    deleteTask(taskUUID: string) {
      this.tasks = this.tasks.filter((t: Task) => t.uuid !== taskUUID);
    },

    createTask(task) {
      this.tasks.push(task);
    },
  },

  persist: true,
});
