import { Message, MessageEmbed } from "discord.js";

import Bot from "../../index";
import { Command, CommandCategory } from "../Command";

export class HelpCommand implements Command {
    name = "help";
    category = CommandCategory.GENERAL;
    description =
        "выводит список всех команд или подробную информацию о команде";
    usage = ["", "[command name]"];
    aliases = ["commands"];

    run(message: Message, args: string[]): any {
        const prefix = Bot.config.getProperty<string>("prefix");
        const color = Bot.config.getProperty<string>("color");

        if (!args.length) {
            const list = (category: CommandCategory, categoryName: string) => {
                const cmdList = Bot.commands.commands
                    .filter((cmd) => cmd.category === category)
                    .map(
                        (cmd) =>
                            `\`${prefix} ${cmd.name}\` – ${cmd.description}`
                    )
                    .join("\n");
                return `**${categoryName}:**\n${cmdList}\n`;
            };

            const data = [];

            data.push(list(CommandCategory.GENERAL, "Основные"));

            if (
                Bot.config
                    .getProperty<string[]>("admins")
                    .includes(message.member.id)
            ) {
                data.push(list(CommandCategory.ADMIN, "Админские"));
            }

            data.push(
                `Напишите \`${prefix} help\` и \`[command name]\`, чтобы получить подробную информацию. **Например:** \`${prefix} help help\``
            );

            const embed = new MessageEmbed()
                .setColor(color)
                .setDescription(data)
                .setTimestamp()
                .setTitle("Список команд");
            message.channel.send({ embed: embed, split: true });
            return;
        }

        const commandName = args.shift().toLowerCase();
        const command = Bot.commands.getCommand(commandName);

        if (!command)
            return message.channel.send(
                `Команда не найдена, воспользуйтесь \`${prefix} help\` или проверьте корректность команды.`
            );

        const embed = new MessageEmbed()
            .setColor(color)
            .setTimestamp()
            .setTitle("Команда: " + command.name);
        if (command.aliases)
            embed.addField("Псевдонимы", command.aliases.join(", "));
        if (command.description)
            embed.addField("Описание", command.description);
        if (command.usage)
            embed.addField(
                "Использование",
                command.usage.map(
                    (usage) => `\`${prefix} ${command.name} ${usage}\``
                )
            );
        // embed.addField("Временное ограничение", `${command.cooldown || 3} секунд`)

        message.channel.send(embed);
    }
}
