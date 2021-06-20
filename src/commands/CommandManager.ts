import { Collection, Message } from "discord.js";

import Bot from "../index";
import { Command, CommandCategory } from "./Command";
import { HelpCommand } from "./general/HelpCommand";

export default class CommandManager {
    commands: Collection<string, Command> = new Collection();
    commandAliases: Map<string, string> = new Map();

    constructor() {
        this.commandsInit();
    }

    commandsInit(): void {
        this.registerCommand(new HelpCommand());
    }

    registerCommand(command: Command): void {
        this.commands.set(command.name, command);
        if (command.aliases) {
            command.aliases.forEach((alias) => {
                this.commandAliases.set(alias, command.name);
            });
        }
    }

    getCommand(commandName: string): Command | undefined {
        if (this.commands.has(commandName))
            return this.commands.get(commandName);
        else if (this.commandAliases.has(commandName))
            return this.commands.get(this.commandAliases.get(commandName));
        else return undefined;
    }

    checkPermissions(command: Command, userID: string): boolean {
        if (
            command.category === CommandCategory.ADMIN &&
            !Bot.config.getProperty<string[]>("admins").includes(userID)
        )
            return false;
        else return true;
    }

    executeCommand(message: Message): any {
        const prefix = Bot.config.getProperty<string>("prefix");

        if (message.author.bot) return;
        if (message.channel.type != "text") return;
        if (!message.content.startsWith(`${prefix} `)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = this.getCommand(commandName);

        if (command) {
            if (!this.checkPermissions(command, message.member.id))
                return message.channel.send(
                    "У вас нет прав для выполнения этой команды!"
                );
            command.run(message, args);
        } else message.channel.send("Команда не найдена!");
    }
}
