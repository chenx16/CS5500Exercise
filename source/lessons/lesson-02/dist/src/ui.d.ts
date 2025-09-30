export declare class CalculatorUI {
    private screen;
    private inputBox;
    private resultBox;
    private errorBox;
    private calculator;
    private formulaBuffer;
    private cursorPosition;
    constructor();
    private initializeUI;
    private setupEventHandlers;
    private handleKeyPress;
    private isValidCharacter;
    private isOperatorOrParenthesis;
    private needsSpaceBefore;
    private needsSpaceAfter;
    private insertCharacter;
    private handleBackspace;
    private moveCursorLeft;
    private moveCursorRight;
    private updateDisplay;
    private tokenize;
    private isValidToken;
    private calculateResult;
    private clearResults;
    start(): void;
}
//# sourceMappingURL=ui.d.ts.map