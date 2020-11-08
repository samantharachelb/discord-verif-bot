import { Command, CommandMessage, Description } from '@typeit/discord';
import { MessageEmbed } from "discord.js";
import { Constants } from "@src/Core/constants";
import sendMessage from "@utils/sendMessage"

export abstract class About {
    @Command("about")
    @Description("Displays \"about\" information for LotionBoy")
    async about(message: CommandMessage) {
        const embed = new MessageEmbed;
        embed.setColor(12427750);
        embed.setAuthor(message.client.user?.username, message.client.user?.displayAvatarURL());
        embed.setTitle("About LotionBoy");
        embed.addField("Version", Constants.version);
        embed.addField("Source Code", "https://github.com/samantharachelb/LotionBoy", false);
        embed.addField("Code monkey behind this affront to God", "Samantha Belnavis", false)
        embed.addField("Coffee Pot Fund", "https://ko-fi.com/emilysamiibocorner", true)
        embed.addField("Help offset server costs", "https://www.patreon.com/emilysamiibocorner", true);
        embed.setFooter("copyright 2020 © made in toronto, ontario with 💕")

        await sendMessage(message, embed, false);
    }
}
