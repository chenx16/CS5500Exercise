# Todo Manager Implementation Plan

## 1. Development Phases

### Phase A: Project Foundation (2-3 hours)
**Objective**: Set up TypeScript project structure and basic tooling

**Tasks**:
- Initialize npm project with proper TypeScript configuration
- Install dependencies: blessed, uuid, commander, date-fns, and dev dependencies
- Configure TypeScript for Node.js terminal applications
- Set up ESLint and Prettier for code quality
- Create MVC directory structure
- Set up build and development scripts

**Success Criteria**:
- `npm run dev` starts the project without errors
- TypeScript compilation works correctly
- Basic "Hello Terminal" blessed screen displays
- All tooling (lint, format) works

**Estimated Complexity**: Low
**Dependencies**: None

### Phase B: Model Layer (3-4 hours)  
**Objective**: Build data structures, validation, and persistence

**Tasks**:
- Create TodoItem interface with validation
- Implement TodoManager class for CRUD operations
- Build FileStorage class for JSON persistence
- Add data validation functions
- Create utility functions for date handling
- Implement error handling for file operations

**Success Criteria**:
- Can create, read, update, delete todos programmatically
- Data persists to `~/.todo-manager/todos.json`
- Invalid data is rejected with clear error messages
- File operations handle errors gracefully (missing directories, permissions, etc.)

**Estimated Complexity**: Medium
**Dependencies**: Phase A complete

### Phase C: Basic CLI Controller (2-3 hours)
**Objective**: Command-line interface for testing Model layer

**Tasks**:
- Set up Commander.js for argument parsing
- Implement basic commands: add, list, complete, remove
- Add input validation and error reporting
- Create simple text-based output formatting
- Build help system

**Success Criteria**:
- `node dist/cli.js add "Buy milk"` creates a todo
- `node dist/cli.js list` shows all todos
- Commands work independently without UI
- Clear error messages for invalid input

**Estimated Complexity**: Low-Medium
**Dependencies**: Phase B complete

### Phase D: Blessed UI Foundation (4-5 hours)
**Objective**: Create blessed screen layout and basic widgets

**Tasks**:
- Set up blessed screen and main layout
- Create TodoList widget (scrollable list)
- Create TodoDetails widget (info display)
- Create StepInput widget (step-by-step input system)
- Create StatusBar widget
- Implement panel switching with Tab key

**Success Criteria**:
- UI displays with proper 4-panel layout
- Can navigate between panels with Tab
- TodoList shows dummy data correctly
- Basic keyboard events work (arrow keys, escape)
- Screen handles terminal resize

**Estimated Complexity**: High (blessed learning curve)
**Dependencies**: Phase A complete (can develop parallel to B/C)

### Phase E: Step Input System (3-4 hours)
**Objective**: Implement the step-by-step todo creation wizard

**Tasks**:
- Build 3-step input flow (title → priority → due date)
- Implement keyboard selection for priority/date options
- Add input validation at each step
- Create visual progress indicator
- Add ability to go back/cancel at any step

**Success Criteria**:
- Pressing 'n' starts step wizard
- Can complete all 3 steps to create todo
- Can cancel or go back at any step
- Visual feedback shows current step and options
- Invalid input shows helpful error messages

**Estimated Complexity**: Medium-High
**Dependencies**: Phase D complete

### Phase F: MVC Integration (3-4 hours)
**Objective**: Connect Model, View, and Controller layers

**Tasks**:
- Integrate TodoManager with blessed UI
- Implement real-time UI updates when data changes
- Connect keyboard shortcuts to Model operations
- Add event system for Model-View communication
- Ensure proper separation of concerns

**Success Criteria**:
- Creating todo through UI saves to file
- UI automatically updates when data changes
- All keyboard shortcuts work (space to toggle, d to delete, etc.)
- Changes persist between app restarts

**Estimated Complexity**: Medium
**Dependencies**: Phases B, E complete

### Phase G: Polish and Error Handling (2-3 hours)
**Objective**: Final touches and robust error handling

**Tasks**:
- Add comprehensive error handling throughout app
- Implement file backup on corruption
- Add confirmation dialogs for destructive operations
- Improve visual styling and colors
- Add help screen (F1 key)
- Performance testing with large todo lists

**Success Criteria**:
- App handles all error conditions gracefully
- No crashes under normal or error conditions
- Visual polish makes app pleasant to use
- Help system provides useful guidance

**Estimated Complexity**: Low-Medium
**Dependencies**: Phase F complete

**Total Estimated Time**: 19-26 hours

## 2. File Structure and Organization

```
todo-manager/
├── src/
│   ├── models/                 # Model Layer
│   │   ├── TodoItem.ts         # Todo interface, validation, types
│   │   ├── TodoManager.ts      # Business logic, CRUD operations
│   │   └── FileStorage.ts      # JSON file persistence
│   ├── controllers/            # Controller Layer
│   │   ├── AppController.ts    # Main app coordination
│   │   └── CLIController.ts    # Command-line interface
│   ├── views/                  # View Layer  
│   │   ├── components/         # Blessed UI components
│   │   │   ├── TodoList.ts     # Scrollable todo list widget
│   │   │   ├── TodoDetails.ts  # Todo details display widget
│   │   │   ├── StepInput.ts    # Step-by-step input wizard
│   │   │   └── StatusBar.ts    # Status and shortcut display
│   │   └── UIManager.ts        # Main view coordinator
│   ├── utils/                  # Shared utilities
│   │   ├── dateUtils.ts        # Date parsing and formatting
│   │   ├── validation.ts       # Input validation functions
│   │   └── fileUtils.ts        # File system utilities
│   ├── types/                  # TypeScript definitions
│   │   └── index.ts            # Exported interfaces and types
│   ├── cli.ts                  # CLI entry point
│   └── app.ts                  # Main UI application entry
├── tests/                      # Test files
│   ├── models/
│   ├── controllers/
│   └── utils/
├── docs/
│   ├── TODO-DESIGN.md
│   └── TODO-PLAN.md
├── package.json
├── tsconfig.json
├── .eslintrc.js
├── .gitignore
└── README.md
```

### File Naming Conventions
- **Classes**: PascalCase (TodoManager.ts, FileStorage.ts)
- **Utilities**: camelCase (dateUtils.ts, validation.ts) 
- **Interfaces**: PascalCase with "I" prefix when needed (ITodoStorage)
- **Constants**: UPPER_SNAKE_CASE exported from types/index.ts

### Module Dependencies
- **Models**: No dependencies on Views or Controllers
- **Controllers**: Import Models, may import View interfaces for events
- **Views**: Import types from Models, communicate through Controllers
- **Utils**: Pure functions, no dependencies on business logic

## 3. Implementation Strategy

### Development Order Rationale

**1. Model First Approach**
Starting with the Model layer provides:
- Stable data foundation for other layers
- Ability to test business logic independently  
- Clear understanding of data requirements
- CLI interface for manual testing without UI complexity

**2. Basic CLI Before Complex UI**
Building CLI controller after Model allows:
- Testing all Model functionality manually
- Understanding data flow patterns
- Debugging data persistence issues
- Creating integration test scenarios

**3. UI Foundation Separately**
Building blessed UI foundation in parallel because:
- UI development has different challenges (layout, events)
- Can develop with mock data initially
- Blessed library has learning curve
- Visual feedback helps with layout decisions

**4. Integration Phase**
Dedicated integration phase because:
- MVC connection requires careful event handling
- Real-time UI updates need proper architecture
- Easy to create tight coupling without planning

### Testing Approach

**Model Layer Testing**:
```typescript
// Unit tests for TodoItem validation
// Integration tests for TodoManager CRUD operations  
// File system mocking for FileStorage tests
describe('TodoManager', () => {
  it('should create valid todo with correct defaults', () => {
    // Test implementation
  });
});
```

**Controller Layer Testing**:
```typescript
// Mock Model layer for isolated testing
// Test CLI argument parsing
// Test command validation and error handling
describe('CLIController', () => {
  it('should parse add command with priority flag', () => {
    // Test implementation  
  });
});
```

**View Layer Testing**:
- Manual testing primarily (limited blessed testing tools)
- Mock data scenarios for different UI states
- Terminal compatibility testing across platforms
- Keyboard event simulation where possible

**Integration Testing**:
- End-to-end workflows (create → edit → complete → delete)
- Data persistence across app restarts
- UI updates when data changes
- Error handling in real scenarios

### Development Environment Setup

**Package.json Scripts**:
```json
{
  "scripts": {
    "dev": "ts-node src/app.ts",
    "cli": "ts-node src/cli.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "test": "jest",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  }
}
```

**Development Workflow**:
1. `npm run dev` - Start UI application
2. `npm run cli -- add "test"` - Test CLI functionality  
3. `npm test` - Run unit tests
4. `npm run lint` - Check code quality

## 4. Risk Assessment

### Technical Challenges

**High Risk: Blessed Library Complexity**
- **Challenge**: Blessed has complex widget system and event handling
- **Early Detection**: Build simple prototype in Phase D
- **Mitigation**: Start with basic widgets, study blessed examples extensively
- **Contingency**: Simplify UI to basic list interface if needed
- **Time Impact**: Could add 4-6 hours to Phase D/E

**Medium Risk: Terminal Compatibility Issues**  
- **Challenge**: Different terminals render blessed widgets inconsistently
- **Early Detection**: Test on Windows CMD, macOS Terminal, Linux terminals during Phase D
- **Mitigation**: Use conservative blessed features, add fallback rendering
- **Contingency**: Create text-only mode for unsupported terminals
- **Time Impact**: Could add 2-3 hours for cross-platform testing

**Medium Risk: Real-time UI Updates**
- **Challenge**: Synchronizing Model changes with View updates
- **Early Detection**: Test during Phase F integration
- **Mitigation**: Use event-driven architecture, clear state management
- **Contingency**: Manual refresh instead of real-time updates
- **Time Impact**: Could add 2-4 hours to Phase F

**Low Risk: File System Operations**
- **Challenge**: File permissions, missing directories, concurrent access
- **Early Detection**: Test edge cases during Phase B
- **Mitigation**: Comprehensive error handling, atomic writes
- **Contingency**: In-memory mode if file system unavailable
- **Time Impact**: Minimal, good TypeScript error handling

### Alternative Approaches

**If Blessed Proves Too Complex**:
- **Option 1**: Switch to Ink (React-based terminal UI)
  - Pros: More familiar React patterns
  - Cons: Requires React knowledge, different architecture
- **Option 2**: CLI-only interface with rich text formatting
  - Pros: Simpler implementation, universal compatibility
  - Cons: Less interactive, doesn't meet lesson objectives

**If MVC Architecture Creates Complexity**:
- **Option 1**: Simplified single-file approach
  - Pros: Easier to understand and debug
  - Cons: Poor separation of concerns, harder to maintain
- **Option 2**: Event-driven architecture
  - Pros: Looser coupling, more scalable
  - Cons: More complex to implement, debugging challenges

### Mitigation Strategies

**For Each Development Phase**:
- Set clear success criteria before starting
- Build minimal viable version first
- Test incrementally, don't wait until phase end
- Have fallback plans for high-risk areas
- Regular architecture reviews to prevent tight coupling

**Learning Support**:
- Keep blessed documentation open during development
- Study blessed examples before implementing similar features  
- Use blessed-contrib library for additional widgets if needed
- Create blessed playground file for experimenting

## 5. Success Metrics and Quality Gates

### Phase Completion Criteria
Each phase must meet ALL success criteria before proceeding:

**Phase Gates**:
- All TypeScript compilation errors resolved
- All planned functionality working as specified
- Code meets ESLint standards
- Manual testing checklist completed
- Performance within acceptable range

### Integration Milestones

**Milestone 1: Model + CLI Integration**
- All CRUD operations work through CLI
- Data persists correctly between CLI runs
- Error handling works for invalid inputs
- Ready for UI development

**Milestone 2: UI Foundation Complete**  
- All panels display correctly
- Basic navigation works
- Mock data displays properly
- Ready for real data integration

**Milestone 3: Full MVC Integration**
- UI and CLI both work with same data
- Real-time updates function correctly
- All user workflows complete end-to-end
- Ready for polish phase

### Quality Assurance

**Code Quality Metrics**:
- Zero TypeScript compilation errors
- Zero ESLint warnings
- 80%+ unit test coverage for Model/Controller layers
- All functions have proper TypeScript types

**Performance Benchmarks**:
- App startup < 1 second with 50 todos
- UI interactions respond < 200ms
- File operations complete < 100ms
- Memory usage stable during extended use

**User Experience Metrics**:
- New user can create todo within 60 seconds
- All common operations accessible with single keypress
- Clear visual feedback for all actions
- Graceful error handling with helpful messages

This implementation plan provides a structured approach while maintaining flexibility for the inevitable learning and iteration that comes with blessed terminal UI development.