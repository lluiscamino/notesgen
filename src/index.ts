#!/usr/bin/env node

import {mkdirSync, readFileSync, writeFileSync} from 'fs';
import {Command} from 'commander';
import {getInputMode, InputFile} from './io/input.js';
import {Path} from './io/path.js';
import {convertMarkdownToHtml} from './markdown/md-to-html.js';

function processFiles(inputFiles: InputFile[]): void {
    for (const {path, correspondingOutputPath} of inputFiles) {
        const markdown = readFileSync(path.path, {encoding: 'utf-8'});
        const output = convertMarkdownToHtml(markdown);
        writeFileSync(correspondingOutputPath.path, output, {encoding: 'utf-8'});
        console.log(`✓ Converted ${path.path} → ${correspondingOutputPath.path}`);
    }
}

function main() {
    const program = new Command();

    program
        .name('notesgen')
        .description('Enhanced markdown processor for academic notes with math, executable code, and more')
        .argument('<inputs...>', 'Input markdown files or directories')
        .option('-o, --output <path>', 'Output file or directory')
        .option('-r, --recursive', 'Process directories recursively')
        .addHelpText('after', `
Examples:
  notesgen README.md                    → README.html
  notesgen README.md -o out.html        → out.html
  notesgen docs/                        → docs/*.html
  notesgen docs/ -o dist/               → dist/*.html
  notesgen docs/ -r                     → docs/**.html
  notesgen docs/ -r -o dist/            → dist/ (mirrored tree)
    `);
    try {
        program.parse();

        const inputs = program.args;
        const {output, recursive} = program.opts();
        const inputMode = getInputMode(inputs);
        const outputPath = output ? Path.fromString(output) : undefined;
        if (outputPath && !outputPath.exists()) {
            mkdirSync(outputPath.path);
        }
        const inputFiles = inputMode.getInputFiles(recursive, outputPath);
        processFiles(inputFiles);
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error: ${error.message}`);
        } else {
            console.error('Error: An unknown error occurred');
        }
        process.exit(1);
    }
}

main();
