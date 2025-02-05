import "reflect-metadata";
import { DataSource } from "typeorm";
import { Task } from "../entities/Task";
import path from "path";
import { app } from "electron";

const databasePath = path.join(app.getPath("userData"), "database.sqlite");
console.log("📁 Database path", databasePath);
export const AppDataSource = new DataSource({
    type: "sqlite",
    database: databasePath,
    synchronize: true, // Permet la création automatique des tables
    logging: true,
    entities: [Task], // Assure-toi que Task est bien présent ici
    migrations: [],
    subscribers: [],
});

export const initializeDatabase = async () => {
    try {
        await AppDataSource.initialize();
        console.log("📦 Database connected successfully at", databasePath);
    } catch (error) {
        console.error("❌ Database connection failed", error);
    }
};
