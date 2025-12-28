import {dirname, parse, resolve, sep} from "path";
import {existsSync, statSync} from "fs";

export class Path {

    private constructor(private readonly absolutePath: string) {
    }

    get path(): string {
        return this.absolutePath;
    }

    get extension(): string | null {
        const ext = parse(this.absolutePath).ext;
        return ext ? ext : null;
    }

    get name(): string {
        return parse(this.absolutePath).name;
    }

    get parent(): Path {
        return new Path(dirname(this.absolutePath));
    }

    /**
     * Resolves a path relative to the path.
     * If the path is a directory, it resolves from inside it.
     * If the path is a file, it resolves from the file's parent directory.
     */
    resolve(relativePath: string): Path {
        const baseDir = this.isLikelyDirectory()
            ? this.absolutePath
            : dirname(this.absolutePath);
        return new Path(resolve(baseDir + sep, relativePath));
    }

    withExtension(extension: string): Path {
        const currentExtension = this.extension;
        if (!currentExtension) {
            return new Path(this.absolutePath + extension);
        }
        return new Path(this.absolutePath.substring(0, this.absolutePath.length - currentExtension.length) + extension);
    }

    /**
     * Checks if the path is a directory.
     * If the path doesn't exist on disk, it guesses based on the string structure.
     */
    private isLikelyDirectory(): boolean {
        if (this.exists()) {
            return this.isDirectory();
        }
        // If it doesn't exist, check if it ends with a slash or has no extension
        return this.absolutePath.endsWith(sep) || !this.extension;
    }

    exists(): boolean {
        return existsSync(this.absolutePath);
    }

    isDirectory(): boolean {
        return this.exists() && statSync(this.absolutePath).isDirectory();
    }

    isFile(): boolean {
        return this.exists() && statSync(this.absolutePath).isFile();
    }

    toString(): string {
        return this.absolutePath;
    }

    static fromString(path: string): Path {
        return new Path(resolve(path));
    }

    static get workingDirectory(): Path {
        return Path.fromString('*');
    }
}