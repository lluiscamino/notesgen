import vm from 'node:vm';

/**
 * Result of evaluating a JavaScript expression.
 */
export interface EvaluationResult {
    success: true;
    value: unknown;
}

/**
 * Error result when evaluation fails.
 */
export interface EvaluationError {
    success: false;
    error: string;
}

export type EvaluationResponse = EvaluationResult | EvaluationError;

/**
 * Evaluates a JavaScript expression in a sandboxed context.
 *
 * @param code - The JavaScript code to evaluate (should be an expression)
 * @param context - Optional context object to provide variables/functions to the sandbox
 * @returns The evaluation result or error
 */
export function evaluateCode(code: string, context: Record<string, any> = {}): EvaluationResponse {
    try {
        if (!context.console) {
            context.console = console;
        }
        vm.createContext(context);
        const trimmedCode = code.trim();
        const result = vm.runInContext(trimmedCode, context, {
            timeout: 1000,
            breakOnSigint: false
        });
        return {
            success: true,
            value: result
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
            success: false,
            error: errorMessage
        };
    }
}

