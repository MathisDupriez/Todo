import { Repository } from "typeorm";
import { AppDataSource } from "../config/datasource";
import { Task } from "../entities/Task";

export class TaskRepository {
    private repo: Repository<Task>;

    constructor() {
        this.repo = AppDataSource.getRepository(Task);
    }

    async findAll(): Promise<Task[]> {
        return this.repo.find();
    }

    async findById(id: number): Promise<Task | null> {
        return this.repo.findOneBy({ id });
    }

    async create(taskData: {
        completed: boolean;
        id: number;
        createdAt: undefined;
        updatedAt: undefined;
        title: string;
        description: string | undefined;
        priority: string;
        status: string;
        endDate: Date | undefined
    }): Promise<Task> {
        const newTask = this.repo.create({
            ...taskData,
            priority: taskData.priority || "Moyenne", // Assure que priority est une string
            status: taskData.status || "À faire", // Assure que status est une string
        });
        return this.repo.save(newTask);
    }

    async update(id: number, taskData: Partial<Task>): Promise<Task | null> {
        const task = await this.repo.findOneBy({ id });
        if (!task) return null;

        Object.assign(task, {
            ...taskData,
            priority: taskData.priority || task.priority,
            status: taskData.status || task.status,
        });

        return this.repo.save(task);
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.repo.delete(id);
        return result.affected ? true : false;
    }
}
