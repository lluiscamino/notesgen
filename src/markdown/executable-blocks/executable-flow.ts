/**
 * @import {Construct, State, TokenizeContext, Tokenizer, Code} from 'micromark-util-types'
 */

import {codes, types} from 'micromark-util-symbol';
import {markdownLineEnding} from 'micromark-util-character';
import type {Code, Construct, State, TokenizeContext, Tokenizer} from 'micromark-util-types';

const codeAt = 64; // '@' character

/**
 * Create a construct for block executable blocks: @@...@@
 *
 * @returns {Construct}
 *   Construct.
 */
export const executableFlow: Construct = {
    tokenize: tokenizeExecutableFlow,
    concrete: true,
    name: 'executableFlow'
};

/**
 * @this {TokenizeContext}
 * @type {Tokenizer}
 */
function tokenizeExecutableFlow(effects: any, ok: State, nok: State): State {
    let sizeOpen = 0;

    return start;

    function start(code: Code) {
        if (code !== codeAt) return nok(code);
        effects.enter('executableFlow');
        effects.enter('executableFlowSequence');
        return sequenceOpen(code);
    }

    function sequenceOpen(code: Code) {
        if (code === codeAt) {
            effects.consume(code);
            sizeOpen++;
            return sequenceOpen;
        }

        // Require at least two @@ for block mode
        if (sizeOpen < 2) {
            return nok(code);
        }

        effects.exit('executableFlowSequence');
        // Handle newline after opening fence
        if (markdownLineEnding(code)) {
            effects.enter(types.lineEnding);
            effects.consume(code);
            effects.exit(types.lineEnding);
            return contentStart;
        }
        effects.enter('executableFlowValue');
        return content;
    }

    function contentStart(code: Code) {
        effects.enter('executableFlowValue');
        return content(code);
    }

    function content(code: Code): State | undefined {
        if (code === codeAt) {
            // Might be closing fence - check it
            effects.exit('executableFlowValue');
            effects.enter('executableFlowSequence');
            let sizeClose = 0;
            return sequenceClose(code, sizeClose);
        }
        if (code === null) {
            effects.exit('executableFlowValue');
            effects.exit('executableFlow');
            return ok(code);
        }
        if (markdownLineEnding(code)) {
            effects.exit('executableFlowValue');
            effects.enter(types.lineEnding);
            effects.consume(code);
            effects.exit(types.lineEnding);
            return contentStart;
        }
        effects.consume(code);
        return content;
    }

    function sequenceClose(code: Code, sizeClose: number): State | undefined {
        if (code === codeAt) {
            effects.consume(code);
            sizeClose++;
            return (c: Code) => sequenceClose(c, sizeClose);
        }

        // If we have enough closing markers (at least 2, matching opening)
        if (sizeClose >= sizeOpen) {
            effects.exit('executableFlowSequence');
            // Allow optional whitespace after closing fence
            if (code === codes.space || code === 9) { // 9 is tab character
                effects.enter(types.whitespace);
                effects.consume(code);
                effects.exit(types.whitespace);
                return after;
            }
            // Must be newline or eof
            if (code === null || markdownLineEnding(code)) {
                if (markdownLineEnding(code)) {
                    effects.enter(types.lineEnding);
                    effects.consume(code);
                    effects.exit(types.lineEnding);
                }
                effects.exit('executableFlow');
                return ok(code);
            }
            // Invalid character after closing fence
            return nok(code);
        }

        // Not enough closing markers, go back to content
        effects.exit('executableFlowSequence');
        effects.enter('executableFlowValue');
        return content(code);
    }

    function after(code: Code) {
        // After whitespace, expect newline or eof
        if (code === null || markdownLineEnding(code)) {
            if (markdownLineEnding(code)) {
                effects.enter(types.lineEnding);
                effects.consume(code);
                effects.exit(types.lineEnding);
            }
            effects.exit('executableFlow');
            return ok(code);
        }
        return nok(code);
    }
}

