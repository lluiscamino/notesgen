/**
 * @import {HtmlExtension} from 'micromark-util-types'
 */

import {evaluateCode} from '../../js/runner.js';
import type {CompileContext, HtmlExtension, Token} from 'micromark-util-types';

/**
 * Create an HTML extension for executable blocks that evaluates JavaScript.
 *
 * @returns {HtmlExtension}
 *   Extension for `micromark` that can be passed in `htmlExtensions`.
 */
export function executableBlocksHtml(): HtmlExtension {
    return {
        enter: {
            executableFlow(this: CompileContext) {
                this.buffer();
            },
            executableText(this: CompileContext) {
                this.buffer();
            }
        } as any,
        exit: {
            executableFlow(this: CompileContext) {
                const code = this.resume().trim();
                const result = evaluateCode(code);

                if (result.success) {
                    const output = formatResult(result.value);
                    this.tag(output);
                } else {
                    this.tag(`<span class="executable-error">Error: ${escapeHtml(result.error)}</span>`);
                }
            },
            executableText(this: CompileContext) {
                const code = this.resume().trim();
                const result = evaluateCode(code);

                if (result.success) {
                    const output = formatResult(result.value);
                    this.tag(output);
                } else {
                    this.tag(`<span class="executable-error">Error: ${escapeHtml(result.error)}</span>`);
                }
            },
            executableFlowValue(this: CompileContext, token: Token) {
                this.raw(this.sliceSerialize(token));
            },
            executableTextValue(this: CompileContext, token: Token) {
                this.raw(this.sliceSerialize(token));
            }
        } as any
    };
}

/**
 * Format the result of evaluation for display.
 */
function formatResult(result: unknown): string {
    if (typeof result === 'string') return escapeHtml(result);
    if (result == null || typeof result === 'number' || typeof result === 'boolean') return String(result);
    if (typeof result === 'object') {
        try {
            return escapeHtml(JSON.stringify(result, null, 2));
        } catch {
            return escapeHtml(String(result));
        }
    }
    return escapeHtml(String(result));
}

/**
 * Escape HTML special characters.
 */
function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

