import { create } from 'zustand';

export type TtodoState = {
    id: string;
    task: string;
    comment: string;
    completed: boolean;
    dueDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const timenow = new Date()
const tomorrow = new Date(timenow);  // Create a copy of today's date
tomorrow.setDate(timenow.getDate() + 1);


const firstTask: TtodoState = {
    id: 'string',
    task: 'string',
    comment: 'string',
    completed: false,
    dueDate: tomorrow,
    createdAt: new Date(),
    updatedAt: new Date(),
}

export type TtodoStore = {
    todos: TtodoState[],
    addTodo: (todo: TtodoState) => void,
    removeTodo: (todo: TtodoState) => void,
    updateTodo: (todo: TtodoState) => void,
}

function updateTodo(todo: TtodoState, todos: TtodoState[]): TtodoState[] {
    const updateTodo = {
        ...todo,
    } as TtodoState;
    updateTodo.updatedAt = new Date();
    const index = todos.findIndex((item) => item.id === updateTodo.id);
    todos.splice(index, 1, updateTodo)
    console.log("update", todos)
    return todos;
}

export const todoStore = create<TtodoStore>((set) => ({
    todos: [firstTask] as TtodoState[],
    addTodo: (todo: TtodoState) => set((state) => ({
        todos: [...state.todos, todo]
    })),
    removeTodo: (todo: TtodoState) => set((state) => ({
        todos: state.todos.filter((item) => item.id !== todo.id)
    })),
    updateTodo: (todo: TtodoState) => set((state) => ({
        todos: updateTodo(todo, state.todos)
    })),
}))