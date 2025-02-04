import { ipcMain } from "electron";
import { TaskService } from "../services/TaskService";
import { Task } from "../entities/Task.ts";

export class TaskController {
    private taskService: TaskService;

    constructor() {
        this.taskService = new TaskService();
        this.registerIpcHandlers();
    }

    private registerIpcHandlers() {
        ipcMain.handle("fetchTasks", async () => {
            return await this.taskService.getTasks();
        });

        ipcMain.handle("addTask", async (_, title: string, description?: string, priority?: string, endDate?: string) => {
            return await this.taskService.createTask(
                title,
                description,
                priority,
                endDate ? new Date(endDate) : undefined
            );
        });

        ipcMain.handle("toggleTask", async (_, id: number) => {
            return await this.taskService.toggleTaskCompletion(id);
        });

        ipcMain.handle("updateTask", async (_, id: number, updates: Partial<Task>) => {
            return await this.taskService.updateTask(id, updates);
        });

        ipcMain.handle("deleteTask", async (_, id: number) => {
            return await this.taskService.deleteTask(id);
        });
    }
}
