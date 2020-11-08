import Firebase from "@src/core/cloud/Firebase";
const logger = require("@src/core/Log").Log.logger;

export abstract class Profile {
    static db = Firebase.datastore;
    static async create(id: string) {
        const docRef = this.db.collection('profiles').doc(id);
        await docRef.set({
            status: "pending",
            discord_id: id
        });
        logger.info(`Created profile for user id: ${id}`)
    }

    static async remove(id: string) {
        const docRef = this.db.collection('profiles').doc(id);
        await docRef.delete();
        logger.info(`Removed profile for user id: ${id}`)
    }

    static async ban(id: any) {
        const profileDocRef = this.db.collection('profiles').doc(id);
        const shitlistDocRef = this.db.collection('shitlist');

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
