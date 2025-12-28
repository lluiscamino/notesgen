/**
 * @import {Construct, State, TokenizeContext, Tokenizer, Code} from 'micromark-util-types'
 */

import type {Code, Construct, State, TokenizeContext, Tokenizer} from 'micromark-util-types';

const codeAt = 64; // '@' character

/**
 * Create a construct for inline executable blocks: @...@
 *
 * @returns {Construct}
 *   Construct.
 */
export function executableText(): Construct {
    return {
        tokenize: tokenizeExecutableText,
        name: 'executableText'
    };

    /**
     * @this {TokenizeContext}
     * @type {Tokenizer}
     */
    function tokenizeExecutableText(effects: any, ok: State, nok: State): State {
        return start;

        function start(code: Code) {
            if (code !== codeAt) return nok(code);
            effects.enter('executableText');
            effects.enter('executableTextSequence');
            effects.consume(code);
            effects.exit('executableTextSequence');
            effects.enter('executableTextValue');
            return value;
        }

        function value(code: Code) {
            if (code === codeAt) {
                effects.exit('executableTextValue');
                effects.enter('executableTextSequence');
                effects.consume(code);
                effects.exit('executableTextSequence');
                effects.exit('executableText');
                return ok;
            }
            if (code === null) {
                return nok(code);
            }
            effects.consume(code);
            return value;
        }
    }
}

