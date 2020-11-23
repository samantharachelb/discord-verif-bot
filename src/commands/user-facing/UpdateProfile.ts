import { Command, CommandMessage, Description, Infos } from "@typeit/discord";
import sendMessage from "@utils/sendMessage";
import newEmbed from "@utils/embeds";
import { Profile } from "@src/core/Profile";
import Config from "@src/core/Config";
import {delayExecution} from "@google-cloud/firestore/build/src/backoff";
const jsonQuery = require('json-query');

export abstract class UpdateProfile {
    @Command("updateprofile")
    @Infos({
        category: "verification",
        usage: "vf;updateprofile"
    })
    @Description("Updates the user's profile")
    async updateprofile(message: CommandMessage) {
        const embed = newEmbed(message);
        const replyTo = `<@${message.author.id}>`;
        const channel_data = jsonQuery(`[name=${message.author.id}]`, { data: message.guild?.channels.cache.array()}).value;
        const channel_id = jsonQuery('[id]', { data: channel_data}).value;

        embed.setTitle("Profile Update")

        if (!channel_id.includes(message.channel.id)) {
            embed.setDescription(`${replyTo}, this command needs to be run in the channel <#${channel_id}>.`)
            return await sendMessage(message, embed);
        } else {
            embed.setDescription(`${replyTo}, changes to your profile have been recorded. This channel will be deleted.`)
            await sendMessage(message, embed, false, false);
            await new Promise(resolve => setTimeout(resolve, 5000));
            return await Profile.removeChannel(message)
        }
    }
}
