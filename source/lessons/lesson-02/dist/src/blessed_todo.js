"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlessedTodoUI = void 0;
const blessed = __importStar(require("blessed"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const todo_1 = require("./todo");
class BlessedTodoUI {
    constructor(todoList, saveFilePath) {
        this.currentFilter = 'all';
        this.showingAddForm = false;
        if (!todoList) {
            throw new Error('TodoList cannot be null');
        }
        this.todoList = todoList;
        this.saveFilePath = saveFilePath;
        this.initializeUI();
    }
    initializeUI() {
        try {
            this.createScreen();
            this.createTaskList();
            this.createAddForm();
            this.createStatusBar();
            this.createErrorBox();
            this.setupKeyHandlers();
            this.refreshTaskList();
        }
        catch (error) {
            throw new Error('Failed to create UI components');
        }
    }
    createScreen() {
        this.screen = blessed.screen({
            smartCSR: true,
            title: 'Todo List Manager',
            fullUnicode: true
        });
    }
    createTaskList() {
        this.taskList = blessed.list({
            parent: this.screen,
            label: ' Tasks ',
            top: 0,
            left: 0,
            width: '100%',
            height: '70%',
            border: {
                type: 'line'
            },
            style: {
                border: {
                    fg: 'cyan'
                },
                selected: {
                    bg: 'blue',
                    fg: 'white'
                }
            },
            keys: true,
            vi: true,
            mouse: true,
            scrollable: true,
            alwaysScroll: true,
            scrollbar: {
                ch: ' ',
                track: {
                    bg: 'cyan'
                },
                style: {
                    inverse: true
                }
            }
        });
    }
    createAddForm() {
        this.addForm = blessed.form({
            parent: this.screen,
            label: ' Add New Task ',
            top: 'center',
            left: 'center',
            width: 60,
            height: 18,
            border: {
                type: 'line'
            },
            style: {
                border: {
                    fg: 'green'
                }
            },
            hidden: true,
            keys: true,
            vi: true
        });
        // Title input
        blessed.text({
            parent: this.addForm,
            content: 'Title:',
            top: 1,
            left: 2,
            width: 10,
            height: 1,
            style: {}
        });
        this.titleInput = blessed.textbox({
            parent: this.addForm,
            top: 1,
            left: 10,
            width: 45,
            height: 3,
            border: {
                type: 'line'
            },
            style: {
                border: {
                    fg: 'white'
                }
            },
            inputOnFocus: true,
            mouse: true
        });
        // Priority input
        blessed.text({
            parent: this.addForm,
            content: 'Priority:',
            top: 5,
            left: 2,
            width: 10,
            height: 1,
            style: {}
        });
        this.priorityInput = blessed.list({
            parent: this.addForm,
            top: 5,
            left: 10,
            width: 20,
            height: 5,
            border: {
                type: 'line'
            },
            style: {
                border: {
                    fg: 'white'
                },
                selected: {
                    bg: 'blue',
                    fg: 'white'
                }
            },
            items: ['HIGH', 'MEDIUM', 'LOW'],
            keys: true,
            vi: true,
            mouse: true,
            clickable: true
        });
        // Category input
        blessed.text({
            parent: this.addForm,
            content: 'Category:',
            top: 7,
            left: 32,
            width: 10,
            height: 1,
            style: {}
        });
        this.categoryInput = blessed.textbox({
            parent: this.addForm,
            top: 7,
            left: 42,
            width: 15,
            height: 3,
            border: {
                type: 'line'
            },
            style: {
                border: {
                    fg: 'white'
                }
            },
            inputOnFocus: true,
            mouse: true
        });
        // Buttons
        const submitButton = blessed.button({
            parent: this.addForm,
            content: 'Add Task',
            top: 11,
            left: 10,
            width: 12,
            height: 3,
            border: {
                type: 'line'
            },
            style: {
                fg: 'black',
                bg: 'green',
                border: {
                    fg: 'green'
                }
            },
            mouse: true
        });
        const cancelButton = blessed.button({
            parent: this.addForm,
            content: 'Cancel',
            top: 11,
            left: 25,
            width: 10,
            height: 3,
            border: {
                type: 'line'
            },
            style: {
                fg: 'black',
                bg: 'red',
                border: {
                    fg: 'red'
                }
            },
            mouse: true
        });
        submitButton.on('press', () => this.handleAddTask());
        cancelButton.on('press', () => this.hideAddForm());
    }
    createStatusBar() {
        this.statusBar = blessed.box({
            parent: this.screen,
            bottom: 2,
            left: 0,
            width: '100%',
            height: 1,
            content: 'Filter: All | Press \'n\' to add, Space to toggle, \'d\' to delete, \'f\' to filter, \'q\' to quit',
            style: {
                fg: 'white',
                bg: 'blue'
            }
        });
    }
    createErrorBox() {
        this.errorBox = blessed.box({
            parent: this.screen,
            bottom: 1,
            left: 0,
            width: '100%',
            height: 1,
            content: '',
            style: {
                fg: 'red'
            },
            hidden: true
        });
    }
    setupKeyHandlers() {
        // Global key handlers
        this.screen.key(['escape', 'q', 'C-c'], () => {
            this.shutdown();
            process.exit(0);
        });
        this.screen.key(['n'], () => {
            if (!this.showingAddForm) {
                this.showAddTaskForm();
            }
        });
        this.screen.key(['f'], () => {
            if (!this.showingAddForm) {
                this.cycleFilter();
            }
        });
        this.screen.key(['s'], () => {
            if (!this.showingAddForm) {
                this.showSearchPrompt();
            }
        });
        // Task list specific handlers
        this.taskList.key(['space'], () => {
            this.toggleTaskCompletion();
        });
        this.taskList.key(['d', 'delete'], () => {
            this.deleteSelectedTask();
        });
        this.taskList.key(['enter'], () => {
            this.showTaskDetails();
        });
        // Add form handlers
        this.addForm.key(['escape'], () => {
            this.hideAddForm();
        });
        this.titleInput.key(['enter', 'tab'], () => {
            this.priorityInput.focus();
        });
        this.priorityInput.key(['enter', 'tab'], () => {
            this.categoryInput.cancel();
            this.categoryInput.readInput();
        });
        this.categoryInput.key(['enter'], () => {
            this.handleAddTask();
        });
        // Add focus event handlers to manage input state
        this.titleInput.on('focus', () => {
            this.titleInput.cancel();
            this.titleInput.readInput();
        });
        this.categoryInput.on('focus', () => {
            this.categoryInput.cancel();
            this.categoryInput.readInput();
        });
        // Focus task list by default
        this.taskList.focus();
    }
    refreshTaskList() {
        try {
            let tasks = [];
            switch (this.currentFilter) {
                case 'completed':
                    tasks = this.todoList.getCompletedTasks();
                    break;
                case 'incomplete':
                    tasks = this.todoList.getIncompleteTasks();
                    break;
                default:
                    tasks = this.todoList.getTasks();
            }
            const taskItems = tasks.map(task => this.formatTaskForDisplay(task));
            this.taskList.setItems(taskItems);
            // Update status bar
            const filterText = this.currentFilter.charAt(0).toUpperCase() + this.currentFilter.slice(1);
            this.statusBar.setContent(`Filter: ${filterText} (${tasks.length} tasks) | Press 'n' to add, Space to toggle, 'd' to delete, 'f' to filter, 'q' to quit`);
            this.screen.render();
        }
        catch (error) {
            throw new Error('Failed to refresh task list');
        }
    }
    formatTaskForDisplay(task) {
        const checkbox = task.completed ? '[✓]' : '[ ]';
        const priority = task.priority !== todo_1.Priority.MEDIUM ? `[${task.priority}] ` : '';
        const category = task.category ? ` (${task.category})` : '';
        const dueDate = task.dueDate ? ` [Due: ${task.dueDate.toDateString()}]` : '';
        const overdue = task.dueDate && task.dueDate < new Date() && !task.completed ? ' [OVERDUE]' : '';
        let title = task.title;
        if (title.length > 50) {
            title = title.substring(0, 47) + '...';
        }
        return `${checkbox} ${priority}${title}${category}${dueDate}${overdue}`;
    }
    showAddTaskForm() {
        this.showingAddForm = true;
        this.addForm.show();
        // Clear values and reset input state
        this.titleInput.setValue('');
        this.categoryInput.setValue('');
        this.priorityInput.select(1); // Default to MEDIUM
        // Ensure clean focus state - cancel any existing input sessions
        this.titleInput.cancel();
        this.categoryInput.cancel();
        // Start fresh input session on title field
        this.titleInput.readInput();
        this.screen.render();
    }
    hideAddForm() {
        this.showingAddForm = false;
        // Cancel any active input sessions
        this.titleInput.cancel();
        this.categoryInput.cancel();
        this.addForm.hide();
        this.taskList.focus();
        this.clearError();
        this.screen.render();
    }
    saveData() {
        try {
            // Ensure save directory exists
            const saveDir = path.dirname(this.saveFilePath);
            if (!fs.existsSync(saveDir)) {
                fs.mkdirSync(saveDir, { recursive: true });
            }
            // Save the data
            const data = this.todoList.toJSON();
            fs.writeFileSync(this.saveFilePath, data, 'utf8');
        }
        catch (error) {
            console.error('Failed to save data:', error);
            this.showError('Failed to save changes');
        }
    }
    handleAddTask() {
        try {
            const title = this.titleInput.getValue().trim();
            if (!title) {
                this.showError('Task title cannot be empty');
                return;
            }
            const priorityIndex = this.priorityInput.selected || 1;
            const priorities = [todo_1.Priority.HIGH, todo_1.Priority.MEDIUM, todo_1.Priority.LOW];
            const priority = priorities[priorityIndex] || todo_1.Priority.MEDIUM;
            const category = this.categoryInput.getValue().trim();
            const categoryOption = category ? category : undefined;
            this.todoList.addTask(title, { priority, category: categoryOption });
            this.saveData(); // Save after adding task
            this.refreshTaskList();
            this.hideAddForm();
            this.showSuccess(`Task "${title}" added successfully`);
        }
        catch (error) {
            this.showError('Failed to add task: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }
    toggleTaskCompletion() {
        try {
            const selectedIndex = this.taskList.selected || 0;
            const tasks = this.getCurrentFilteredTasks();
            if (selectedIndex >= 0 && selectedIndex < tasks.length) {
                const task = tasks[selectedIndex];
                if (task && task.completed) {
                    this.todoList.uncompleteTask(task.id);
                }
                else if (task) {
                    this.todoList.completeTask(task.id);
                }
                this.saveData(); // Save after toggling completion
                this.refreshTaskList();
            }
        }
        catch (error) {
            this.showError('Failed to toggle task completion: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }
    deleteSelectedTask() {
        try {
            const selectedIndex = this.taskList.selected || 0;
            const tasks = this.getCurrentFilteredTasks();
            if (selectedIndex >= 0 && selectedIndex < tasks.length) {
                const task = tasks[selectedIndex];
                if (task) {
                    this.todoList.deleteTask(task.id);
                    this.saveData(); // Save after deleting task
                    this.refreshTaskList();
                    this.showSuccess(`Task "${task.title}" deleted`);
                }
            }
        }
        catch (error) {
            this.showError('Failed to delete task: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }
    showTaskDetails() {
        const selectedIndex = this.taskList.selected || 0;
        const tasks = this.getCurrentFilteredTasks();
        if (selectedIndex >= 0 && selectedIndex < tasks.length) {
            const task = tasks[selectedIndex];
            if (task) {
                const details = this.formatTaskDetails(task);
                const detailBox = blessed.box({
                    parent: this.screen,
                    label: ' Task Details ',
                    top: 'center',
                    left: 'center',
                    width: 60,
                    height: 15,
                    content: details,
                    border: {
                        type: 'line'
                    },
                    style: {
                        border: {
                            fg: 'yellow'
                        }
                    },
                    keys: true,
                    vi: true
                });
                detailBox.key(['escape', 'enter', 'q'], () => {
                    detailBox.destroy();
                    this.taskList.focus();
                    this.screen.render();
                });
                detailBox.focus();
                this.screen.render();
            }
        }
    }
    formatTaskDetails(task) {
        const lines = [
            `Title: ${task.title}`,
            `Status: ${task.completed ? 'Completed' : 'Incomplete'}`,
            `Priority: ${task.priority}`,
            `Category: ${task.category || 'None'}`,
            `Created: ${task.createdAt.toLocaleString()}`,
            `Due Date: ${task.dueDate ? task.dueDate.toLocaleString() : 'None'}`,
            `Completed: ${task.completedAt ? task.completedAt.toLocaleString() : 'Not completed'}`,
            '',
            'Press ESC or Enter to close'
        ];
        return lines.join('\n');
    }
    cycleFilter() {
        const filters = ['all', 'incomplete', 'completed'];
        const currentIndex = filters.indexOf(this.currentFilter);
        const nextIndex = (currentIndex + 1) % filters.length;
        const nextFilter = filters[nextIndex];
        if (nextFilter) {
            this.currentFilter = nextFilter;
        }
        this.refreshTaskList();
    }
    showSearchPrompt() {
        const searchBox = blessed.textbox({
            parent: this.screen,
            label: ' Search Tasks ',
            top: 'center',
            left: 'center',
            width: 50,
            height: 3,
            border: {
                type: 'line'
            },
            style: {
                fg: 'yellow',
                bg: 'blue',
                border: {
                    fg: 'green'
                }
            },
            inputOnFocus: true,
            mouse: true
        });
        searchBox.key(['escape'], () => {
            searchBox.destroy();
            this.taskList.focus();
            this.screen.render();
        });
        searchBox.key(['enter'], () => {
            const query = searchBox.getValue().trim();
            searchBox.destroy();
            if (query) {
                this.performSearch(query);
            }
            else {
                this.taskList.focus();
            }
            this.screen.render();
        });
        searchBox.focus();
        this.screen.render();
    }
    performSearch(query) {
        try {
            const results = this.todoList.searchTasks(query);
            const resultItems = results.map(task => this.formatTaskForDisplay(task));
            this.taskList.setItems(resultItems);
            this.statusBar.setContent(`Search results for "${query}" (${results.length} found) | Press 'f' to return to filter view`);
            this.screen.render();
        }
        catch (error) {
            this.showError('Search failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
    }
    getCurrentFilteredTasks() {
        switch (this.currentFilter) {
            case 'completed':
                return this.todoList.getCompletedTasks();
            case 'incomplete':
                return this.todoList.getIncompleteTasks();
            default:
                return this.todoList.getTasks();
        }
    }
    setFilter(filter) {
        if (!['all', 'completed', 'incomplete'].includes(filter)) {
            throw new Error('Invalid filter type');
        }
        this.currentFilter = filter;
        this.refreshTaskList();
    }
    showError(message) {
        if (!message) {
            throw new Error('Error message cannot be null');
        }
        this.errorBox.setContent(`Error: ${message}`);
        this.errorBox.show();
        this.screen.render();
        // Auto-hide error after 3 seconds
        setTimeout(() => {
            this.clearError();
        }, 3000);
    }
    showSuccess(message) {
        this.errorBox.setContent(`Success: ${message}`);
        this.errorBox.style.fg = 'green';
        this.errorBox.show();
        this.screen.render();
        // Auto-hide success message after 2 seconds
        setTimeout(() => {
            this.clearError();
        }, 2000);
    }
    clearError() {
        this.errorBox.hide();
        this.errorBox.style.fg = 'red'; // Reset to error color
        this.screen.render();
    }
    start() {
        this.taskList.focus();
        this.screen.render();
        // Keep the process alive
        process.stdin.setRawMode(true);
        process.stdin.resume();
    }
    shutdown() {
        try {
            this.screen.destroy();
        }
        catch (error) {
            throw new Error('Failed to shutdown UI');
        }
    }
}
exports.BlessedTodoUI = BlessedTodoUI;
//# sourceMappingURL=blessed_todo.js.map