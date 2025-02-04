import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "text" })
    title!: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @Column({ type: "text", default: "Moyenne" }) // Utilisation de "text" au lieu de "enum"
    priority!: "Basse" | "Moyenne" | "Haute";

    @Column({ type: "text", default: "À faire" }) // Utilisation de "text" au lieu de "enum"
    status!: "À faire" | "En cours" | "Terminé";

    @Column({ type: "boolean", default: false })
    completed!: boolean;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @Column({ type: "datetime", nullable: true })
    endDate?: Date;
}
