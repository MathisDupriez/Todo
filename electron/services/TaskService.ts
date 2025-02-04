import { Task } from "../entities/Task";
import { TaskRepository } from "../repositories/TaskRepository";

export class TaskService {
    private taskRepo: TaskRepository;

    constructor() {
        this.taskRepo = new TaskRepository();
    }

    async getTasks(): Promise<Task[]> {
        return this.taskRepo.findAll();
    }

    async getTaskById(id: number): Promise<Task | null> {
        return this.taskRepo.findById(id);
    }

    async createTask(title: string, description?: string, priority?: string, endDate?: Date): Promise<Task> {
        if (!title.trim()) throw new Error("Le titre ne peut pas être vide");

        return this.taskRepo.create({
            completed: false,
            id: 0,
            createdAt: undefined,
            updatedAt: undefined,
            title,
            description,
            priority: priority || "Moyenne",
            status: "À faire",
            endDate
        });
    }

    async updateTask(id: number, updates: Partial<Task>): Promise<Task | null> {
        const existingTask = await this.taskRepo.findById(id);
        if (!existingTask) throw new Error("Tâche introuvable");

        return this.taskRepo.update(id, updates);
    }

    async toggleTaskCompletion(id: number): Promise<Task | null> {
        const task = await this.taskRepo.findById(id);
        if (!task) throw new Error("Tâche introuvable");

        task.completed = !task.completed;
        task.status = task.completed ? "Terminé" : "En cours";

        return this.taskRepo.update(id, task);
    }

    async deleteTask(id: number): Promise<boolean> {
        return this.taskRepo.delete(id);
    }
}
