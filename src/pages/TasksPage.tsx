import { useEffect, useState } from "react";

declare global {
    interface Window {
        electronAPI: {
            fetchTasks: () => Promise<Task[]>;
            addTask: (title: string, description: string, priority: "Basse" | "Moyenne" | "Haute") => Promise<Task>;
            toggleTask: (id: number) => Promise<Task>;
            deleteTask: (id: number) => Promise<void>;
        };
    }
}
import {
    Container,
    TextField,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Checkbox,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

type Task = {
    id: number;
    title: string;
    description?: string;
    priority: "Basse" | "Moyenne" | "Haute";
    status: "À faire" | "En cours" | "Terminé";
    completed: boolean;
    createdAt: string;
    endDate?: string;
};

const TasksPage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<"Basse" | "Moyenne" | "Haute">("Moyenne");
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    useEffect(() => {
        window.electronAPI.fetchTasks().then(setTasks);
    }, []);

    const addTask = async () => {
        if (newTask.trim()) {
            const task = await window.electronAPI.addTask(newTask, description, priority);
            setTasks([...tasks, task]);
            setNewTask("");
            setDescription("");
            setPriority("Moyenne");
        }
    };

    const toggleTask = async (id: number) => {
        const updatedTask = await window.electronAPI.toggleTask(id);
        setTasks(tasks.map((task) => (task.id === id ? updatedTask : task)));
    };

    const deleteTask = async (id: number) => {
        await window.electronAPI.deleteTask(id);
        setTasks(tasks.filter((task) => task.id !== id));
    };

    const filteredTasks = statusFilter
        ? tasks.filter((task) => task.status === statusFilter)
        : tasks;

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>📋 Gestion des Tâches</Typography>

            {/* Formulaire d'ajout */}
            <TextField
                fullWidth
                label="Titre de la tâche"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Priorité</InputLabel>
                <Select value={priority} onChange={(e) => setPriority(e.target.value as "Basse" | "Moyenne" | "Haute")}>
                    <MenuItem value="Basse">🔵 Basse</MenuItem>
                    <MenuItem value="Moyenne">🟡 Moyenne</MenuItem>
                    <MenuItem value="Haute">🔴 Haute</MenuItem>
                </Select>
            </FormControl>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={addTask}
                fullWidth
                sx={{ mb: 3 }}
            >
                Ajouter une tâche
            </Button>

            {/* Filtre */}
            <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Filtrer par statut</InputLabel>
                <Select value={statusFilter || ""} onChange={(e) => setStatusFilter(e.target.value || null)}>
                    <MenuItem value="">Toutes</MenuItem>
                    <MenuItem value="À faire">📌 À Faire</MenuItem>
                    <MenuItem value="En cours">🚀 En cours</MenuItem>
                    <MenuItem value="Terminé">✅ Terminé</MenuItem>
                </Select>
            </FormControl>

            {/* Liste des tâches */}
            <List>
                {filteredTasks.map((task) => (
                    <ListItem key={task.id} sx={{ backgroundColor: task.completed ? "rgba(0,255,0,0.1)" : "white", borderRadius: 1, mb: 1 }}>
                        <Checkbox checked={task.completed} onChange={() => toggleTask(task.id)} />
                        <ListItemText primary={task.title} secondary={task.priority + (task.endDate ? ` - 📅 ${task.endDate}` : "")} />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(task.id)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </Container>
    );
};

export default TasksPage;
