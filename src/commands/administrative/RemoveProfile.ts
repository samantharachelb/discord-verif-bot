import { Command, CommandMessage, Description } from "@typeit/discord";
import sendMessage from "@utils/sendMessage.ts";
import newEmbed from "@utils/embeds";
import Firebase from "@src/core/cloud/Firebase";
import { Profile } from "@src/core/Profile";
import { Permissions  } from "@src/core/Permissions";

export abstract class RemoveProfile {
    @Description("Removes a profile from the database")
    @Command("removeProfile :userMention")
    async removeProfile(message: CommandMessage) {
        const embed = newEmbed(message);
        const replyTo = `<@${message.author.id}>`;
        const db = Firebase.datastore;
        const dbRef = db.collection('profiles').doc(message.author.id);
        let userID: string | undefined;

        embed.setTitle("Remove Profile");


        if (!Permissions.checkAdmin(message)) {
            embed.setTitle("Insufficient Permissions")
            embed.setDescription(`${replyTo}\n I'm sorry Dave, I can't let you do that.`);
            embed.setColor(10027008)
            return await sendMessage(message, embed);
        }

        if (!message.mentions.users.first()?.id) {
            embed.setDescription(`${replyTo} you must specify which user's profile should be deleted`)
            return await sendMessage(message, embed);
        }

        const profileDoc = await dbRef.get();

        if (!profileDoc.exists) {
            embed.setDescription(`${replyTo} cannot remove a profile that does not exist`)
            return await sendMessage(message, embed);
        } else {
            // @ts-ignore: object already checked to see if it's undefined
            userID = message.mentions.users.first().id;
            await Profile.remove(userID);
            // @ts-ignore: object already checked to see if it's undefined
            embed.setDescription(`${replyTo} removed profile for <@${message.mentions.users.first().id}>`);
            return await sendMessage(message, embed);
        }
    }
}
