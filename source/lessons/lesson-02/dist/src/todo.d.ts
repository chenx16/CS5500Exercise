export declare enum Priority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH"
}
export interface Todo {
    id: string;
    title: string;
    completed: boolean;
    priority: Priority;
    category: string | null;
    dueDate: Date | null;
    createdAt: Date;
    completedAt: Date | null;
}
export interface TaskOptions {
    priority?: Priority;
    category?: string | undefined;
    dueDate?: Date;
}
export declare class TodoList {
    private tasks;
    private nextId;
    constructor();
    addTask(title: string, options?: TaskOptions): Todo;
    completeTask(id: string): void;
    uncompleteTask(id: string): void;
    deleteTask(id: string): void;
    getTasks(): Todo[];
    getIncompleteTasks(): Todo[];
    getCompletedTasks(): Todo[];
    updateTaskPriority(id: string, priority: Priority): void;
    updateTaskDueDate(id: string, dueDate: Date | null): void;
    updateTaskCategory(id: string, category: string): void;
    getTasksByPriority(): Todo[];
    getTasksByDueDate(): Todo[];
    getTasksByCategory(category: string): Todo[];
    getCategories(): string[];
    isTaskOverdue(id: string): boolean;
    searchTasks(query: string): Todo[];
    toJSON(): string;
    static fromJSON(json: string): TodoList;
}
//# sourceMappingURL=todo.d.ts.map