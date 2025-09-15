# Todo Manager System Design

## 1. Executive Summary

### Project Overview
A sophisticated terminal-based todo list manager built with Node.js, TypeScript, and the blessed library. The application follows MVC architecture principles to provide a clean separation of concerns and maintainable codebase.

### Key Features
- Multi-panel terminal UI with intuitive navigation
- Full CRUD operations for todo items
- Step-by-step todo creation with selectable options
- Priority levels and due date management
- Command-line interface for programmatic access
- Persistent file-based storage
- Real-time UI updates
- Keyboard navigation and shortcuts

### Technology Stack
- **Runtime**: Node.js (v16+)
- **Language**: TypeScript
- **UI Library**: blessed (terminal UI framework)
- **Storage**: JSON file-based persistence
- **Architecture**: Model-View-Controller (MVC)

## 2. System Architecture

### MVC Architecture Overview
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Model       │    │   Controller    │    │      View       │
│                 │    │                 │    │                 │
│ • TodoItem      │◄──►│ • CLI Commands  │◄──►│ • Blessed UI    │
│ • TodoManager   │    │ • Event Router  │    │ • Panel Manager │
│ • FileStorage   │    │ • State Manager │    │ • UI Components │
│ • Validation    │    │ • Input Handler │    │ • Step Wizard   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Responsibilities

**Model Layer:**
- Data structures and business entities
- Data validation and integrity
- Persistence layer (file I/O)
- Business rules and constraints

**Controller Layer:**
- Step-by-step input processing
- Event routing and handling
- Coordination between Model and View
- Application state management

**View Layer:**
- Terminal UI layout and styling
- User interaction handling
- Step-by-step input wizards
- Panel management and navigation

## 3. User Interface Design

### Terminal Layout
```
┌─────────────────────────────────────────────────────────────────┐
│ Todo Manager v1.0                               [Help: F1]      │
├─────────────────────────────┬───────────────────────────────────┤
│        TODO LIST            │       TODO DETAILS                │
│ ┌─────────────────────────┐ │ ┌─────────────────────────────────┐ │
│ │ [!] Buy groceries  HIGH │ │ │ Title: Buy groceries            │ │
│ │ [✓] Finish homework     │ │ │ Priority: HIGH                  │ │
│ │ [ ] Call mom       MED  │ │ │ Due: 2024-09-20                │ │
│ │ [ ] Walk dog            │ │ │ Status: Pending                 │ │
│ │                         │ │ │ Created: 2024-09-15             │ │
│ │                         │ │ │ Description: Need milk, eggs... │ │
│ └─────────────────────────┘ │ └─────────────────────────────────┘ │
├─────────────────────────────┴───────────────────────────────────┤
│ Step 1/3: Enter title: Buy new laptop_                         │
├─────────────────────────────────────────────────────────────────┤
│ [n]ew [e]dit [d]elete [space]toggle [tab]switch │ Total: 4/1   │
└─────────────────────────────────────────────────────────────────┘
```

### Step-by-Step Input Flow

**Step 1: Title Input**
```
Step 1/3: Enter title: ________________________
[Enter to continue, Esc to cancel]
```

**Step 2: Priority Selection**
```
Step 2/3: Select priority:
[L]ow  [M]edium  [H]igh  [U]rgent
Press letter to select...
```

**Step 3: Due Date Selection**
```
Step 3/3: Due date:
[T]oday  [1]Tomorrow  [W]eek  [C]ustom  [N]one
Press letter to select...
```

### Navigation and Shortcuts

**Global Navigation:**
- `Tab` - Switch between panels
- `Esc` - Cancel current operation/return to main
- `F1` - Help screen
- `Ctrl+Q` - Quit application

**Todo List Panel:**
- `↑/↓` - Navigate todos
- `Space` - Toggle completion
- `Enter` - View/edit details
- `n` - New todo (starts step wizard)
- `d` - Delete selected todo
- `e` - Edit selected todo

**Step Input Mode:**
- `Enter` - Confirm current step
- `Esc` - Cancel and return to main
- `Backspace` - Go back one step
- Letter keys - Select options (priority/date)

## 4. Data Model

### TodoItem Structure
```typescript
interface TodoItem {
  id: string;                    // UUID
  title: string;                 // 1-100 characters, required
  description?: string;          // Optional, max 500 characters
  status: 'pending' | 'completed';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate?: Date;               // Optional due date
  createdAt: Date;              // Auto-generated
  updatedAt: Date;              // Auto-updated
}
```

### Data Validation Rules
- **Title**: Required, 1-100 characters, no leading/trailing whitespace
- **Description**: Optional, max 500 characters
- **Status**: Must be 'pending' or 'completed'
- **Priority**: Must be one of four predefined levels
- **DueDate**: Must be future date (if provided)

### Storage Format
```json
{
  "version": "1.0.0",
  "todos": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Buy groceries",
      "description": "Need milk, eggs, bread",
      "status": "pending",
      "priority": "HIGH",
      "dueDate": "2024-09-20T00:00:00.000Z",
      "createdAt": "2024-09-15T10:30:00.000Z",
      "updatedAt": "2024-09-15T10:30:00.000Z"
    }
  ],
  "metadata": {
    "lastModified": "2024-09-15T10:30:00.000Z",
    "totalItems": 1,
    "completedItems": 0
  }
}
```

### File Structure
- **Primary Storage**: `~/.todo-manager/todos.json`
- **Config File**: `~/.todo-manager/config.json`

## 5. Technical Specifications

### Dependencies
```json
{
  "dependencies": {
    "blessed": "^0.1.81",
    "uuid": "^9.0.0",
    "commander": "^9.4.1",
    "date-fns": "^2.29.3"
  },
  "devDependencies": {
    "@types/blessed": "^0.1.21",
    "@types/uuid": "^8.3.4",
    "typescript": "^4.8.0",
    "ts-node": "^10.9.1"
  }
}
```

### User Experience Principles
- **Simple Input**: Only title requires typing, everything else is selection
- **Clear Visual Feedback**: Each step shows progress and options clearly
- **Consistent Navigation**: Same keys work across all panels
- **Forgiving Interface**: Easy to cancel or go back at any step
- **Minimal Typing**: Most operations use single key shortcuts

### Date Selection Options
- **Today**: Sets due date to current date
- **Tomorrow**: Sets due date to next day
- **Week**: Sets due date to 7 days from now
- **Custom**: Allows manual date entry (YYYY-MM-DD)
- **None**: No due date

### Priority Visual Indicators
- **URGENT**: `[!]` red text
- **HIGH**: `[!]` yellow text  
- **MEDIUM**: `[M]` default color
- **LOW**: `[L]` dim text

## 6. Success Criteria

### Functional Requirements
- Create todos with step-by-step wizard
- View, edit, delete todos
- Toggle completion status
- Priority and due date management
- Persistent storage
- CLI interface for all operations

### User Experience Requirements
- New users can create a todo in under 30 seconds
- All common operations accessible with single keypress
- Clear visual feedback for all actions
- No typing required except for title text
- Intuitive navigation between panels

This design emphasizes simplicity and user-friendliness while maintaining the power of a full-featured todo manager.