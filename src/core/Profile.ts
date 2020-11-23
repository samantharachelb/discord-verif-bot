import Firebase from "@src/core/cloud/Firebase";
const logger = require("@src/core/Log").Log.logger;
const jsonQuery = require('json-query');
import {Constants} from "@src/core/Constants";

export abstract class Profile {
    static db = Firebase.datastore;
    static async create(id: string) {
        const docRef = this.db.collection('profiles').doc(id);
        await docRef.set({
            status: "unverified",
            discord_id: id
        });
        logger.info(`Created profile for user id: ${id}`)
    }

    static async remove(id: string) {
        const docRef = this.db.collection('profiles').doc(id);
        await docRef.delete();
        logger.info(`Removed profile for user id: ${id}`)
    }

    static async createChannel(message: any) {
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
    }

    static async removeChannel(message: any) {
        message.channel.delete()
    }

    static async ban(id: any, reason: string) {
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

    static async prescreen(id: any) {
        const shitlistDocRef = this.db.collection('shitlist');
        const snapshot = await shitlistDocRef.where('discord_id', '==', id).get();
        if (!snapshot.empty) {
            logger.info(`Found user ${id} in shitlist. Booting from server now...`);
        }
    }
}
