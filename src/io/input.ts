import {Path} from "./path.js";
import {readdirSync} from "fs";

const INPUT_EXTENSION = '.md';
const OUTPUT_EXTENSION = '.html';

export interface InputFile {
    path: Path;
    correspondingOutputPath: Path;
}

export interface InputMode {
    getInputFiles(recursive: boolean, outputPath?: Path): InputFile[];
}

class DirInputMode implements InputMode {
    constructor(private readonly dirPath: Path) {
    }

    getInputFiles(recursive: boolean, outputPath?: Path): InputFile[] {
        const outputDir = this.getOutputDirectory(outputPath);
        return findFilesWithExtension(this.dirPath, INPUT_EXTENSION, recursive).map(inputFile => ({
            path: inputFile,
            correspondingOutputPath: outputDir.resolve(inputFile.withExtension(OUTPUT_EXTENSION).path)
        }));
    }

    private getOutputDirectory(outputPath?: Path): Path {
        if (!outputPath) {
            return this.dirPath;
        }
        if (outputPath.isDirectory()) {
            return outputPath;
        }
        throw new Error('Output path must be a directory');
    }
}

class SingleFileInputMode implements InputMode {
    constructor(private readonly filePath: Path) {
    }

    getInputFiles(_recursive: boolean, outputPath?: Path): InputFile[] {
        return [{
            path: this.filePath,
            correspondingOutputPath: this.getOutputPath(outputPath)
        }];
    }

    private getOutputPath(outputPath?: Path): Path {
        if (!outputPath) {
            return this.filePath.resolve(this.filePath.name + OUTPUT_EXTENSION);
        }
        if (outputPath.isFile()) {
            return outputPath;
        }
        return outputPath.resolve(this.filePath.name + OUTPUT_EXTENSION);
    }
}

export function getInputMode(inputs: string[]): InputMode {
    if (inputs.length > 1) {
        throw new Error('Multiple input files or directories are not supported');
    }
    if (inputs.length === 0) {
        return new DirInputMode(Path.workingDirectory);
    }
    const path = Path.fromString(inputs[0]);
    if (path.isFile()) {
        return new SingleFileInputMode(path);
    }
    if (path.isDirectory()) {
        return new DirInputMode(path);
    }
    throw new Error(`Invalid input path: ${path}`);
}

function findFilesWithExtension(path: Path, extension: string, recursive: boolean = false): Path[] {
    if (path.isFile()) {
        return path.extension === extension ? [path] : [];
    }
    if (!path.isDirectory()) {
        throw new Error(`Path not found: ${path}`);
    }
    const entries = readdirSync(path.path, {withFileTypes: true});
    const files: Path[] = [];
    for (const entry of entries) {
        const fullPath = path.resolve(entry.name);
        if (entry.isFile() && fullPath.extension === extension) {
            files.push(fullPath);
        } else if (recursive && entry.isDirectory()) {
            files.push(...findFilesWithExtension(fullPath, extension, recursive));
        }
    }
    return files;
}