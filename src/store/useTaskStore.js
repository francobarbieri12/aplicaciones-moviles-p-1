import { create } from 'zustand';
import { getTasks, saveTasks } from '../../utils/storage';

export const useTaskStore = create((set, get) => ({
  tasks: [],
  isLoading: false,

  loadTasks: async () => {
    set({ isLoading: true });
    const tasks = await getTasks();
    set({ tasks, isLoading: false });
  },

  addTask: async (task) => {
    const { tasks } = get();
    const updatedTasks = [...tasks, task];
    set({ tasks: updatedTasks });
    await saveTasks(updatedTasks);
  },

  deleteTask: async (id) => {
    const { tasks } = get();
    const updatedTasks = tasks.filter(t => t.id !== id);
    set({ tasks: updatedTasks });
    await saveTasks(updatedTasks);
  },

  toggleTask: async (id) => {
    const { tasks } = get();
    const updatedTasks = tasks.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    set({ tasks: updatedTasks });
    await saveTasks(updatedTasks);
  },
}));
