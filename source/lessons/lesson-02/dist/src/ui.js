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
exports.CalculatorUI = void 0;
const blessed = __importStar(require("blessed"));
const calculator_1 = require("./calculator");
class CalculatorUI {
    constructor() {
        this.calculator = new calculator_1.Calculator();
        this.formulaBuffer = '';
        this.cursorPosition = 0;
        this.initializeUI();
    }
    initializeUI() {
        // Create screen
        this.screen = blessed.screen({
            smartCSR: true,
            title: 'Calculator'
        });
        // Create title
        const title = blessed.box({
            top: 0,
            left: 'center',
            width: 'shrink',
            height: 3,
            content: '{center}{bold}Recursive Descent Calculator{/bold}{/center}\n{center}Use +, -, *, /, (, ) and numbers{/center}',
            tags: true,
            border: {
                type: 'line'
            },
            style: {
                fg: 'white',
                border: {
                    fg: 'cyan'
                }
            }
        });
        // Create input display box
        const inputLabel = blessed.box({
            top: 4,
            left: 2,
            width: '96%',
            height: 3,
            content: 'Formula:',
            tags: true,
            border: {
                type: 'line'
            },
            style: {
                fg: 'yellow',
                border: {
                    fg: 'yellow'
                }
            }
        });
        // Create input display box
        this.inputBox = blessed.box({
            top: 5,
            left: 4,
            width: '92%',
            height: 1,
            content: '',
            tags: true,
            style: {
                fg: 'white',
                bg: 'black'
            }
        });
        // Create result box
        this.resultBox = blessed.box({
            top: 8,
            left: 2,
            width: '96%',
            height: 3,
            content: 'Result: ',
            tags: true,
            border: {
                type: 'line'
            },
            style: {
                fg: 'green',
                border: {
                    fg: 'green'
                }
            }
        });
        // Create error box
        this.errorBox = blessed.box({
            top: 12,
            left: 2,
            width: '96%',
            height: 3,
            content: 'Error: ',
            tags: true,
            border: {
                type: 'line'
            },
            style: {
                fg: 'red',
                border: {
                    fg: 'red'
                }
            }
        });
        // Create instructions box
        const instructions = blessed.box({
            top: 16,
            left: 2,
            width: '96%',
            height: 6,
            content: '{center}{bold}Instructions:{/bold}{/center}\n' +
                '• Type numbers, operators (+, -, *, /), and parentheses\n' +
                '• Use arrow keys to move cursor left/right\n' +
                '• Use Backspace to delete characters\n' +
                '• Press Enter to calculate\n' +
                '• Press Ctrl+C or q to quit',
            tags: true,
            border: {
                type: 'line'
            },
            style: {
                fg: 'white',
                border: {
                    fg: 'white'
                }
            }
        });
        // Append all elements to screen
        this.screen.append(title);
        this.screen.append(inputLabel);
        this.screen.append(this.inputBox);
        this.screen.append(this.resultBox);
        this.screen.append(this.errorBox);
        this.screen.append(instructions);
        this.setupEventHandlers();
        this.updateDisplay();
    }
    setupEventHandlers() {
        // Handle key presses
        this.screen.on('keypress', (ch, key) => {
            this.handleKeyPress(ch, key);
        });
        // Focus on the screen to receive key events
        this.screen.key(['escape', 'q', 'C-c'], () => {
            this.screen.destroy();
            process.exit(0);
        });
    }
    handleKeyPress(ch, key) {
        // Ignore function keys and other special keys
        if (key.name && key.name.match(/^f\d+$/i)) {
            return;
        }
        switch (key.name) {
            case 'enter':
                this.calculateResult();
                break;
            case 'backspace':
                this.handleBackspace();
                break;
            case 'left':
                this.moveCursorLeft();
                break;
            case 'right':
                this.moveCursorRight();
                break;
            default:
                if (ch && this.isValidCharacter(ch)) {
                    this.insertCharacter(ch);
                }
                break;
        }
        this.updateDisplay();
    }
    isValidCharacter(ch) {
        // Allow digits, decimal point, operators, parentheses, and spaces
        return /[0-9.+\-*/() ]/.test(ch);
    }
    isOperatorOrParenthesis(ch) {
        return /[+\-*/()]/.test(ch);
    }
    needsSpaceBefore(ch) {
        if (this.cursorPosition === 0)
            return false;
        const prevChar = this.formulaBuffer[this.cursorPosition - 1];
        if (!prevChar)
            return false;
        // Don't add space if previous character is already a space
        if (prevChar === ' ')
            return false;
        // Don't add space before opening parenthesis if previous char is opening parenthesis
        if (ch === '(' && prevChar === '(')
            return false;
        // Don't add space after opening parenthesis (so no space before next char)
        if (prevChar === '(')
            return false;
        return true;
    }
    needsSpaceAfter(ch) {
        // If we're at the end of the buffer, don't add space after closing parenthesis
        if (this.cursorPosition >= this.formulaBuffer.length) {
            return ch !== ')';
        }
        const nextChar = this.formulaBuffer[this.cursorPosition];
        if (!nextChar) {
            return ch !== ')';
        }
        // Don't add space if next character is already a space
        if (nextChar === ' ')
            return false;
        // Don't add space after closing parenthesis if next char is closing parenthesis
        if (ch === ')' && nextChar === ')')
            return false;
        // Don't add space before closing parenthesis (so no space after previous char)
        if (nextChar === ')')
            return false;
        return true;
    }
    insertCharacter(ch) {
        if (this.isOperatorOrParenthesis(ch)) {
            // Add spaces around operators and parentheses
            const beforeSpace = this.needsSpaceBefore(ch) ? ' ' : '';
            const afterSpace = this.needsSpaceAfter(ch) ? ' ' : '';
            const insertion = beforeSpace + ch + afterSpace;
            this.formulaBuffer =
                this.formulaBuffer.slice(0, this.cursorPosition) +
                    insertion +
                    this.formulaBuffer.slice(this.cursorPosition);
            this.cursorPosition += insertion.length;
        }
        else {
            this.formulaBuffer =
                this.formulaBuffer.slice(0, this.cursorPosition) +
                    ch +
                    this.formulaBuffer.slice(this.cursorPosition);
            this.cursorPosition++;
        }
    }
    handleBackspace() {
        if (this.cursorPosition > 0) {
            this.formulaBuffer =
                this.formulaBuffer.slice(0, this.cursorPosition - 1) +
                    this.formulaBuffer.slice(this.cursorPosition);
            this.cursorPosition--;
        }
    }
    moveCursorLeft() {
        if (this.cursorPosition > 0) {
            this.cursorPosition--;
        }
    }
    moveCursorRight() {
        if (this.cursorPosition < this.formulaBuffer.length) {
            this.cursorPosition++;
        }
    }
    updateDisplay() {
        // Create display string with cursor indicator
        let displayText = this.formulaBuffer;
        if (this.cursorPosition <= displayText.length) {
            displayText =
                displayText.slice(0, this.cursorPosition) +
                    '|' +
                    displayText.slice(this.cursorPosition);
        }
        this.inputBox.setContent(displayText);
        this.screen.render();
    }
    tokenize(input) {
        // Split by spaces and filter out empty strings and invalid tokens
        return input.split(/\s+/)
            .filter(token => token.length > 0)
            .filter(token => this.isValidToken(token));
    }
    isValidToken(token) {
        // Valid tokens are: numbers (including decimals), operators, or parentheses
        return /^(\d+\.?\d*|\+|\-|\*|\/|\(|\))$/.test(token);
    }
    calculateResult() {
        if (this.formulaBuffer.trim() === '') {
            this.clearResults();
            return;
        }
        const tokens = this.tokenize(this.formulaBuffer);
        const result = this.calculator.calculate(tokens);
        if (result.error) {
            this.resultBox.setContent('Result: ');
            this.errorBox.setContent(`Error: ${result.error}`);
        }
        else {
            this.resultBox.setContent(`Result: ${result.result}`);
            this.errorBox.setContent('Error: ');
        }
        this.screen.render();
    }
    clearResults() {
        this.resultBox.setContent('Result: ');
        this.errorBox.setContent('Error: ');
        this.screen.render();
    }
    start() {
        this.screen.render();
    }
}
exports.CalculatorUI = CalculatorUI;
//# sourceMappingURL=ui.js.map