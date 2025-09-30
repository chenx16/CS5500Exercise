export interface CalculatorResult {
    result?: number;
    error?: string;
}
export declare class Calculator {
    private tokens;
    private position;
    constructor();
    /**
     * Calculate the result of a mathematical expression
     * @param tokens Array of tokens (numbers, operators, parentheses)
     * @returns CalculatorResult with either result or error
     */
    calculate(tokens: string[]): CalculatorResult;
    /**
     * Parse expression: term (('+' | '-') term)*
     */
    private parseExpression;
    /**
     * Parse term: factor (('*' | '/') factor)*
     */
    private parseTerm;
    /**
     * Parse factor: number | '(' expression ')' | '-' factor | '+' factor
     */
    private parseFactor;
    /**
     * Check if a token is a valid number
     */
    private isNumber;
}
//# sourceMappingURL=calculator.d.ts.map