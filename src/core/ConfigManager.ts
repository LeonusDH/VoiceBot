import fs from "fs";
import path from "path";

import dotenv from "dotenv";
dotenv.config();

export default class ConfigManager {
    private configFile = path.resolve(
        __dirname,
        "../../runtime/botConfig.json"
    );
    private config: BotConfig;
    readonly botToken: string = process.env.BOT_TOKEN;

    constructor() {
        if (fs.existsSync(this.configFile)) {
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
        const config = new BotConfig();
        config.prefix = "v";
        config.color = "#00aaff";
        config.admins = [];
        config.voiceChannels = [];
        return config;
    }

    private load(): void {
        const config = fs.readFileSync(this.configFile);
        try {
            this.config = JSON.parse(config.toString());
        } catch (e) {
            if (e instanceof SyntaxError) {
                console.error(
                    "Json syntax broken. Try fix or delete botConfig.json"
                );
                console.error(e);
            }
        }
    }

    private save(): void {
        fs.writeFileSync(this.configFile, JSON.stringify(this.config, null, 4));
    }
}

export class BotConfig {
    prefix: string;
    color: string;
    admins: string[];
    voiceChannels: string[];
}
