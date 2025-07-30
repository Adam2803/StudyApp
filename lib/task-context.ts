import { createContext, useContext } from "react";

export type Task = {
  id: string;
  title: string;
  description: string;
  tag: string;
  completed: boolean;
};

type TaskContextType = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
};

export const TaskContext = createContext<TaskContextType | null>(null);

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used inside TaskProvider");
  return ctx;
};
