import { Client, VoiceChannel, VoiceState } from "discord.js";

import CommandManager from "./../commands/CommandManager";
import ConfigManager from "./ConfigManager";

export default class Core {
    client = new Client();
    config = new ConfigManager();
    commands = new CommandManager();

    constructor() {
        this.client.on("message", (m) => this.commands.executeCommand(m));
        this.client.on("voiceStateUpdate", (_, after) =>
            this.voiceStateUpdate(after)
        );
        this.client.on("ready", () => {
            console.log("Bot started");
            this.client.user.setActivity(
                `${this.config.getProperty("prefix")} help`,
                { type: "LISTENING" }
            );
        });
        this.client.login(this.config.botToken);
    }

    async voiceStateUpdate(after: VoiceState): Promise<void> {
        const voiceChannels =
            this.config.getProperty<string[]>("voiceChannels");

        if (voiceChannels.includes(after.channelID)) {
            const channel = await after.guild.channels.create(
                `Комната ${after.member.user.username}`,
                {
                    type: "voice",
                    parent: after.channel.parent,
                }
            );
            channel.createOverwrite(after.id, {
                VIEW_CHANNEL: true,
                MANAGE_CHANNELS: true,
                CONNECT: true,
            });
            after.setChannel(channel);
        }

        // Некоторая магия
        this.client.channels.cache
            .filter((el) => voiceChannels.includes(el.id))
            .forEach((el: VoiceChannel) =>
                el.parent.children
                    .filter(
                        (c) =>
                            !voiceChannels.includes(c.id) &&
                            c.type === "voice" &&
                            c.members.size === 0
                    )
                    .forEach((c) => c.delete("В голосовой комнате 0 людей!"))
            );
    }
}
