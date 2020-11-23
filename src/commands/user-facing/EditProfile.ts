import { Command, CommandMessage, Description, Infos } from "@typeit/discord";
import sendMessage from "@utils/sendMessage";
import newEmbed from "@utils/embeds";
import Firebase from "@src/core/cloud/Firebase";
const jsonQuery = require('json-query')
import { Profile } from "@src/core/Profile"

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

        // check if a profile already exists
        const profileDoc = await dbRef.get();

        if(!profileDoc.exists) {
            embed.setTitle("Edit Profile")
            embed.setDescription(`${replyTo} you do not have a profile. Use the command \`vf;newprofile\` to create one.`)
            return await sendMessage(message, embed);
        } else {
            const channels = jsonQuery('[name]', { data: message.guild?.channels.cache.array()}).value;
            const channel_data = jsonQuery(`[name=${message.author.id}]`, { data: message.guild?.channels.cache.array()}).value;
            const channel_id = jsonQuery('[id]', { data: channel_data}).value;

            embed.setTitle("Edit Profile");
            embed.setDescription(`${replyTo} profile in editing mode. Make all changes in the channel <#${channel_id}> and use the command \`vf;update\` to submit those changes`);

            if (channels.includes(message.author.id)) {
                console.log("channel already exists")
            } else {
                await Profile.createChannel(message);
            }
            return await sendMessage(message, embed);
        }
    }
}
