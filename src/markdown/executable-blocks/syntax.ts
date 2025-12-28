/**
 * @import {Extension} from 'micromark-util-types'
 */

import {executableFlow} from './executable-flow.js';
import {executableText} from './executable-text.js';
import type {Extension} from 'micromark-util-types';

const codeAt = 64; // '@' character

/**
 * Create an extension for `micromark` to enable executable block syntax.
 *
 * @returns {Extension}
 *   Extension for `micromark` that can be passed in `extensions`, to
 *   enable executable block syntax.
 */
export function executableBlocks(): Extension {
    return {
        flow: {[codeAt]: executableFlow},
        text: {[codeAt]: executableText()}
    };
}

