import Firebase from "@src/core/cloud/Firebase";
const logger = require("@src/core/Log").Log.logger;
const jsonQuery = require('json-query');
import {Constants} from "@src/core/Constants";
import newEmbed from "@utils/embeds";
import ChannelScreen from "@src/core/ChannelScreen";
export abstract class Profile {
    static db = Firebase.datastore;
    static async create(id: string): Promise<void> {
        const docRef = this.db.collection('profiles').doc(id);
        await docRef.set({
            status: "unverified",
            discord_id: id
        });
        logger.info(`Created profile for user id: ${id}`)
    }

    static async remove(id: string): Promise<void> {
        const docRef = this.db.collection('profiles').doc(id);
        await docRef.delete();
        logger.info(`Removed profile for user id: ${id}`)
    }

    static async createChannel(message: any): Promise<void> {
        message.guild?.channels?.create(message.author.id, {
            type: "text",
            permissionOverwrites: [
                {
                    id: message.guild.id,
                    deny: ["READ_MESSAGE_HISTORY", "VIEW_CHANNEL"]
                },
                {
                    id: message.author.id,
                    allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "EMBED_LINKS", "SEND_MESSAGES"]
                },
                {
                    id: Constants.botID,
                    allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY", "EMBED_LINKS", "SEND_MESSAGES"]
                }
            ]
        });
        const embed = newEmbed(message);

        embed.setTitle("User Verification")
        embed.setDescription(
            "To get started, please tell use your name, birthday, and provide a link to your facebook account." +
            "You got this invite because you're in a facebook group, so asking \"why\" or saying \"im not comfortable with that\""+
            "is not an option."
        );
        embed.addField("vf;addName [your name]", "adds your name to your server profile", false);
        embed.addField("vf;addLink [facebook link]", "adds the link to your facebook to your server profile", false);
        embed.addField("vf;birthday [yyyy-mm-dd]", "adds your birthday to your server profile. please use the format"+
                        "\"yyyy-mm-dd\" (ex: 1999-12-31)", false
        )
        await new Promise(resolve => setTimeout(resolve, 200));
        let channel_id = await ChannelScreen.getChannelId(message.author.id, message);
        await message.client.channels.cache.get(channel_id).send(embed);
    }

    static async removeChannel(message: any): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 200));
        await message.channel.delete()
    }

    static async ban(id: any, reason: string): Promise<void> {
        const profileDocRef = this.db.collection('profiles').doc(id);
        const shitlistDocRef = this.db.collection('shitlist');
        const snapshot = await profileDocRef.get();
        if(snapshot.exists) {
            await shitlistDocRef.set(snapshot.data());
            await shitlistDocRef.update({
                reason: reason,
                status: "banned"
            })
        }

        await this.remove(id);

        logger.info(`Added profile to shitlist for user id: ${id}`)
    }

    static async prescreen(id: any): Promise<void> {
        const shitlistDocRef = this.db.collection('shitlist');
        const snapshot = await shitlistDocRef.where('discord_id', '==', id).get();
        if (!snapshot.empty) {
            logger.info(`Found user ${id} in shitlist. Booting from server now...`);
        }
    }
}
