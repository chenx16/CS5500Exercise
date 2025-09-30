// Todo Model - Skeleton Implementation
// This file contains stub implementations that compile and run but don't perform actual functionality

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
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

export class TodoList {
  private tasks: Todo[] = [];
  private nextId: number = 1;

  constructor() {
    // Stub constructor - initializes empty task array for testing compatibility
    this.tasks = [];
  }

  // Core functionality stubs
  addTask(title: string, options?: TaskOptions): Todo {
    console.log(`[STUB] Adding task: ${title}`);
    
    // Validate input for test compatibility
    if (!title || title.trim() === '') {
      throw new Error('Task title cannot be empty');
    }
    
    const task: Todo = {
      id: `task-${this.nextId++}`,
      title: title.trim(), // Trim whitespace for test compatibility
      completed: false,
      priority: options?.priority || Priority.MEDIUM,
      category: options?.category || null,
      dueDate: options?.dueDate || null,
      createdAt: new Date(),
      completedAt: null
    };
    
    // Store task for test compatibility (but still log as stub)
    this.tasks.push(task);
    return task;
  }

  completeTask(id: string): void {
    if (!id) {
      throw new Error('Task ID cannot be null or undefined');
    }
    
    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    
    // Only update if not already completed to avoid changing timestamp
    if (!task.completed) {
      task.completed = true;
      task.completedAt = new Date();
    }
  }

  uncompleteTask(id: string): void {
    if (!id) {
      throw new Error('Task ID cannot be null or undefined');
    }
    
    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    
    task.completed = false;
    task.completedAt = null;
  }

  deleteTask(id: string): void {
    if (!id) {
      throw new Error('Task ID cannot be null or undefined');
    }
    
    const taskIndex = this.tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error('Task not found');
    }
    
    this.tasks.splice(taskIndex, 1);
  }

  getTasks(): Todo[] {
    // Return a copy of the tasks array to prevent external modification
    return [...this.tasks];
  }

  getIncompleteTasks(): Todo[] {
    return this.tasks.filter(task => !task.completed);
  }

  getCompletedTasks(): Todo[] {
    return this.tasks.filter(task => task.completed);
  }

  // Organization features stubs
  updateTaskPriority(id: string, priority: Priority): void {
    if (!id) {
      throw new Error('Task not found');
    }
    
    // Validate priority
    if (!Object.values(Priority).includes(priority)) {
      throw new Error('Invalid priority level');
    }
    
    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    
    task.priority = priority;
  }

  updateTaskDueDate(id: string, dueDate: Date | null): void {
    if (!id) {
      throw new Error('Task not found');
    }
    
    // Validate date if provided
    if (dueDate && isNaN(dueDate.getTime())) {
      throw new Error('Invalid date');
    }
    
    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    
    task.dueDate = dueDate;
  }

  updateTaskCategory(id: string, category: string): void {
    if (!id) {
      throw new Error('Task not found');
    }
    
    const task = this.tasks.find(t => t.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    
    task.category = category;
  }

  getTasksByPriority(): Todo[] {
    // Define priority order (HIGH first, then MEDIUM, then LOW)
    const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
    
    return [...this.tasks].sort((a, b) => {
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  getTasksByDueDate(): Todo[] {
    return [...this.tasks].sort((a, b) => {
      // Tasks without due dates go to the end
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      
      // Sort by due date ascending (earliest first)
      return a.dueDate.getTime() - b.dueDate.getTime();
    });
  }

  getTasksByCategory(category: string): Todo[] {
    return this.tasks.filter(task => task.category === category);
  }

  getCategories(): string[] {
    const categories = new Set<string>();
    this.tasks.forEach(task => {
      if (task.category) {
        categories.add(task.category);
      }
    });
    return Array.from(categories);
  }

  isTaskOverdue(id: string): boolean {
    const task = this.tasks.find(t => t.id === id);
    if (!task || !task.dueDate) {
      return false;
    }
    
    const now = new Date();
    return task.dueDate < now;
  }

  // Search functionality stub
  searchTasks(query: string): Todo[] {
    if (query === null || query === undefined) {
      throw new Error('Search term cannot be null or undefined');
    }
    
    // Empty string should return all tasks
    if (query === '') {
      return [...this.tasks];
    }
    
    const searchTerm = query.toLowerCase();
    return this.tasks.filter(task => {
      // Search in title
      const titleMatch = task.title.toLowerCase().includes(searchTerm);
      
      // Search in category (if it exists)
      const categoryMatch = task.category ? 
        task.category.toLowerCase().includes(searchTerm) : false;
      
      return titleMatch || categoryMatch;
    });
  }

  // Data persistence stubs
  toJSON(): string {
    return JSON.stringify({ 
      tasks: this.tasks,
      nextId: this.nextId 
    });
  }

  static fromJSON(json: string): TodoList {
    if (!json) {
      throw new Error('JSON string cannot be null or undefined');
    }
    
    let data;
    try {
      data = JSON.parse(json);
    } catch (error) {
      throw new Error('Invalid JSON format');
    }
    
    // Validate data structure
    if (!data || typeof data !== 'object' || !Array.isArray(data.tasks)) {
      throw new Error('Invalid todo data format');
    }
    
    const todoList = new TodoList();
    
    // Restore nextId if available
    if (data.nextId) {
      todoList.nextId = data.nextId;
    }
    
    // Restore tasks with proper date objects
    todoList.tasks = data.tasks.map((task: any) => {
      // Validate each task has required fields
      if (!task.id || !task.title || task.completed === undefined) {
        throw new Error('Invalid todo data format');
      }
      
      return {
        ...task,
        createdAt: new Date(task.createdAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : null,
        dueDate: task.dueDate ? new Date(task.dueDate) : null
      };
    });
    
    return todoList;
  }
}
