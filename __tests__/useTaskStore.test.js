const { create } = require('zustand');

const useTaskStore = create((set, get) => ({
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

const getTasks = jest.fn(() => Promise.resolve([]));
const saveTasks = jest.fn(() => Promise.resolve());

describe('useTaskStore', () => {
  beforeEach(() => {
    useTaskStore.setState({ tasks: [], isLoading: false });
    getTasks.mockClear();
    saveTasks.mockClear();
  });

  it('addTask agrega una tarea al estado', async () => {
    const newTask = {
      id: 1,
      title: 'Tarea test',
      recordatorio: '',
      imagen: null,
      ubicacion: null,
      contacto: null,
      fechaEvento: null,
      completed: false
    };

    await useTaskStore.getState().addTask(newTask);

    expect(useTaskStore.getState().tasks).toHaveLength(1);
    expect(useTaskStore.getState().tasks[0].title).toBe('Tarea test');
  });

  it('deleteTask elimina una tarea', async () => {
    const newTask = {
      id: 1,
      title: 'Tarea a eliminar',
      recordatorio: '',
      imagen: null,
      ubicacion: null,
      contacto: null,
      fechaEvento: null,
      completed: false
    };

    await useTaskStore.getState().addTask(newTask);
    expect(useTaskStore.getState().tasks).toHaveLength(1);

    await useTaskStore.getState().deleteTask(1);
    expect(useTaskStore.getState().tasks).toHaveLength(0);
  });

  it('toggleTask cambia completed de false a true', async () => {
    const newTask = {
      id: 1,
      title: 'Tarea toggle',
      recordatorio: '',
      imagen: null,
      ubicacion: null,
      contacto: null,
      fechaEvento: null,
      completed: false
    };

    await useTaskStore.getState().addTask(newTask);
    expect(useTaskStore.getState().tasks[0].completed).toBe(false);

    await useTaskStore.getState().toggleTask(1);
    expect(useTaskStore.getState().tasks[0].completed).toBe(true);
  });
});