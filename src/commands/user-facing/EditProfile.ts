import { Command, CommandMessage, Description, Infos } from "@typeit/discord";
import sendMessage from "@utils/sendMessage";
import newEmbed from "@utils/embeds";
import Firebase from "@src/core/cloud/Firebase";
import ChannelScreen from "@src/core/ChannelScreen";
import { Profile } from "@src/core/Profile";
const jsonQuery = require('json-query');

export abstract class EditProfile {
    @Command("editprofile")
    @Infos({
        category: "verification",
        usage: "vf;editprofile"
    })
    @Description("Allows the user to make changes to their profile")
    async edit(message: CommandMessage) {
        const embed = newEmbed(message);
        const replyTo = `<@${message.author.id}>`;
        const db = Firebase.datastore;
        const dbRef = db.collection('profiles').doc(message.author.id);
        let channel_id: string;

        // check if a profile already exists
        const profileDoc = await dbRef.get();

        // @todo: localize "edit profile" command

        if(!profileDoc.exists) {
            embed.setTitle("Edit Profile")
            embed.setDescription(`${replyTo} you do not have a profile. Use the command \`vf;newprofile\` to create one.`)
            return await sendMessage(message, embed);
        } else {
            embed.setTitle("Edit Profile");

            if (ChannelScreen.checkExists(message.author.id, message) === "channelFound") {
                channel_id = await ChannelScreen.getChannelId(message.author.id, message);
                embed.setDescription(`${replyTo} profile already in editing mode. Make all changes in the channel <#${channel_id}> and use the command \`vf;update\` to submit those changes`);
            } else {
                await Profile.createChannel(message);
                channel_id = await ChannelScreen.getChannelId(message.author.id, message);
                embed.setDescription(`${replyTo} profile in editing mode. Make all changes in the channel <#${channel_id}> and use the command \`vf;update\` to submit those changes`);
            }
            return await sendMessage(message, embed);
        }
    }
}
