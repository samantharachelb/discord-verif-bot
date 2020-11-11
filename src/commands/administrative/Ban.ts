import { Command, CommandMessage, Description } from "@typeit/discord";
import sendMessage from "@utils/sendMessage";
import newEmbed from "@utils/embeds";
import Firebase from "@src/core/cloud/Firebase";
import { Profile } from "@src/core/Profile";
import Config from "@src/core/Config";

export abstract class Ban {
    @Description("Bans a User")
    @Command("ban :user :reason")
    async create(message: CommandMessage) {
        const embed = newEmbed(message);
        const replyTo = `<@${message.author.id}>`;
        const db = Firebase.datastore;
        let dbRef: any;
        let shitlistRef: any;
        let userId: string;

        embed.setTitle("Ban User");

        if (!message.mentions.users.first()) {
            embed.setDescription(`${replyTo} ${Config.localeData['']}`)
            return await sendMessage(message, embed);
        } else {
            // @ts-ignore: already checked for in the previous step
            userId = message.mentions.users.first().id;
        }

        dbRef = db.collection('profiles').doc(userId);
        shitlistRef = db.collection('shitlist').doc(userId);

        let banReason = message.content.split(" ").slice(2).join(" ");
        if (!banReason) {
            embed.setDescription(`${replyTo}, reason required for sending user to the shadow realm`);
            return await sendMessage(message, embed);
        } else {
            await Profile.ban(userId, banReason);
        }

        embed.setDescription(`${replyTo}, user: <@${userId}> has been shitlisted and sent to the shadow realm`);
        //message.mentions.users.first().ban();

        return await sendMessage(message, embed);

    }
}
