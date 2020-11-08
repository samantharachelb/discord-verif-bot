import { MessageEmbed } from "discord.js";

export default function newEmbed(message: any) {
    const embed = new MessageEmbed();
    embed.setAuthor(message.client.user?.username,  message.client.user?.displayAvatarURL())
    embed.setColor(7506394);
    return embed;
}
