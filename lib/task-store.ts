import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Task = {
  id: string;
  title: string;
  description: string;
  tag: string;
  completed: boolean;
  imageUri: string | null;
};

// --- THIS IS THE LINE THAT CHANGED ---
// We use 'Partial' to make all properties in the type optional.
type UpdatableTaskProps = Partial<Omit<Task, "id" | "completed">>;

type TaskState = {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "completed" | "imageUri">) => void;
  deleteTask: (id: string) => void;
  editTask: (id: string, updated: UpdatableTaskProps) => void;
  toggleTask: (id: string) => void;
  setTasks: (tasks: Task[]) => void;
};

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      addTask: (task) => {
        const newTask: Task = {
          ...task,
          id: Date.now().toString(),
          completed: false,
          imageUri: null,
        };
        set({ tasks: [...get().tasks, newTask] });
      },
      deleteTask: (id) => {
        set({ tasks: get().tasks.filter((t) => t.id !== id) });
      },
      editTask: (id, updated) => {
        set({
          tasks: get().tasks.map((t) =>
            t.id === id ? { ...t, ...updated } : t
          ),
        });
      },
      toggleTask: (id) => {
        set({
          tasks: get().tasks.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          ),
        });
      },
      setTasks: (tasks) => set({ tasks }),
    }),
    {
      name: "task-storage",
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);
