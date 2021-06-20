import fs from "fs";
import path from "path";

export default class FileHelper {
    static rootDir = process.cwd();
    static runtimeDir = path.join(FileHelper.rootDir, "runtime");
    static configFile = path.join(FileHelper.runtimeDir, "botConfig.json");

    static createMissing(): void {
        if (!fs.existsSync(this.runtimeDir)) fs.mkdirSync(this.runtimeDir);
    }
}
