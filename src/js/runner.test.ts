import {test} from 'node:test';
import assert from 'node:assert';
import {evaluateCode} from './runner.js';

test('evaluateCode: simple arithmetic', () => {
    const result = evaluateCode('2 + 3');
    assert.ok(result.success);
    assert.strictEqual(result.value, 5);
});

test('evaluateCode: division', () => {
    const result = evaluateCode('(2 + 3) / 5');
    assert.ok(result.success);
    assert.strictEqual(result.value, 1);
});

test('evaluateCode: string concatenation', () => {
    const result = evaluateCode('"Hello " + "World"');
    assert.ok(result.success);
    assert.strictEqual(result.value, 'Hello World');
});

test('evaluateCode: boolean expressions', () => {
    const result = evaluateCode('5 > 3 && 2 < 4');
    assert.ok(result.success);
    assert.strictEqual(result.value, true);
});

test('evaluateCode: with context variables', () => {
    const result = evaluateCode('x * 2', {x: 5});
    assert.ok(result.success);
    assert.strictEqual(result.value, 10);
});

test('evaluateCode: context variables modification', () => {
    const context: Record<string, any> = {x: 2};
    const result = evaluateCode('x += 40', context);
    assert.ok(result.success);
    assert.strictEqual(context.x, 42);
    // x += 40 is an expression that returns the new value
    assert.strictEqual(result.value, 42);
});

test('evaluateCode: new variables in context', () => {
    const context: Record<string, any> = {x: 2};
    const result = evaluateCode('var y = 100; x', context);
    assert.ok(result.success);
    assert.strictEqual(context.y, 100);
    assert.strictEqual(result.value, 2); // Returns the value of the last expression
});

test('evaluateCode: error handling for invalid code', () => {
    const result = evaluateCode('invalid syntax !!@#$');
    assert.ok(!result.success);
    assert.ok(result.error.length > 0);
});

test('evaluateCode: error handling for runtime errors', () => {
    const result = evaluateCode('undefinedVar.someProperty');
    assert.ok(!result.success);
    assert.ok(result.error.length > 0);
});

test('evaluateCode: null and undefined', () => {
    const nullResult = evaluateCode('null');
    assert.ok(nullResult.success);
    assert.strictEqual(nullResult.value, null);

    const undefinedResult = evaluateCode('undefined');
    assert.ok(undefinedResult.success);
    assert.strictEqual(undefinedResult.value, undefined);
});

test('evaluateCode: objects', () => {
    const result = evaluateCode('({ a: 1, b: 2 })');
    assert.ok(result.success);
    const obj = result.value as Record<string, number>;
    assert.strictEqual(obj.a, 1);
    assert.strictEqual(obj.b, 2);
});

test('evaluateCode: arrays', () => {
    const result = evaluateCode('[1, 2, 3]');
    assert.ok(result.success);
    // Arrays are returned as objects, so we check the values match
    const arr = result.value as number[];
    assert.ok(Array.isArray(arr));
    assert.strictEqual(arr[0], 1);
    assert.strictEqual(arr[1], 2);
    assert.strictEqual(arr[2], 3);
});

test('evaluateCode: functions', () => {
    const result = evaluateCode('(function(x) { return x * 2; })(5)');
    assert.ok(result.success);
    assert.strictEqual(result.value, 10);
});

test('evaluateCode: multiple operations with context', () => {
    const context: Record<string, any> = {globalVar: 1};
    for (let i = 0; i < 10; i++) {
        evaluateCode('globalVar *= 2', context);
    }
    assert.strictEqual(context.globalVar, 1024);
});

test('evaluateCode: console available in sandbox', () => {
    // This should not throw an error
    const result = evaluateCode('typeof console');
    assert.ok(result.success);
    assert.strictEqual(result.value, 'object');
});

