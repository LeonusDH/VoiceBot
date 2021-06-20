import fs from "fs";

import dotenv from "dotenv";
import FileHelper from "./FileHelper";
dotenv.config();

export default class ConfigManager {
    private config: BotConfig;
    readonly botToken: string = process.env.BOT_TOKEN;

    constructor() {
        if (fs.existsSync(FileHelper.configFile)) {
            console.log("Loading configuration");
            this.load();
        } else {
            console.log("Configuration not found! Create default config");
            this.config = this.getDefaults();
            this.save();
        }
    }

    getProperty<T>(property: string): T {
        return this.config[property];
    }

    private getDefaults(): BotConfig {
        return {
            prefix: "v",
            color: "#00aaff",
            admins: [],
            voiceChannels: [],
        };
    }

    private load(): void {
        try {
            this.config = JSON.parse(
                fs.readFileSync(FileHelper.configFile).toString()
            );
        } catch (e) {
            if (e instanceof SyntaxError) {
                console.error(
                    "Json syntax broken. Try fix or delete botConfig.json"
                );
            } else {
                console.error(e);
            }
            process.exit(1);
        }
    }

    private save(): void {
        fs.writeFileSync(
            FileHelper.configFile,
            JSON.stringify(this.config, null, 4)
        );
    }
}

export interface BotConfig {
    prefix: string;
    color: string;
    admins: string[];
    voiceChannels: string[];
}
