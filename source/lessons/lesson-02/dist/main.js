#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ui_1 = require("./src/ui");
/**
 * Main entry point for the Recursive Descent Calculator
 *
 * This calculator supports:
 * - Basic arithmetic operations: +, -, *, /
 * - Parentheses for grouping
 * - Decimal numbers
 * - Unary operators (+ and -)
 *
 * Usage:
 * - Type mathematical expressions using numbers, operators, and parentheses
 * - Separate tokens with spaces (e.g., "2 + 3 * ( 4 - 1 )")
 * - Use arrow keys to navigate and backspace to edit
 * - Press Enter to calculate
 * - Press Ctrl+C or 'q' to quit
 */
function main() {
    console.log('Starting Recursive Descent Calculator...');
    console.log('Press Ctrl+C or \'q\' to quit');
    try {
        const ui = new ui_1.CalculatorUI();
        ui.start();
    }
    catch (error) {
        console.error('Failed to start calculator:', error);
        process.exit(1);
    }
}
// Handle uncaught exceptions gracefully
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
// Start the application
if (require.main === module) {
    main();
}
//# sourceMappingURL=main.js.map