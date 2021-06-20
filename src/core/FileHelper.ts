import fs from "fs";
import path from "path";

export default class FileHelper {
    static rootDir: string = process.cwd();
    static runtimeDir: string = path.join(FileHelper.rootDir, "runtime");

    static createMissing(): void {
        if (!fs.existsSync(this.runtimeDir)) fs.mkdirSync(this.runtimeDir);
    }
}
