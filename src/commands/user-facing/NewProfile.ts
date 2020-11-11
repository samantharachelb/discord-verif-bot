import { Command, CommandMessage, Description, Infos } from '@typeit/discord';
import sendMessage from "@utils/sendMessage"
import newEmbed from "@utils/embeds";
import Firebase from "@src/core/cloud/Firebase";
import { Profile } from "@src/core/Profile";

export abstract class NewProfile {
    @Command("newprofile")
    @Infos({
        category: "verification",
        usage: "vf;newprofile"
    })
    @Description("Creates a new verification Profile")
    async create(message: CommandMessage) {
        const embed = newEmbed(message);
        const replyTo = `<@${message.author.id}>`;
        const db = Firebase.datastore;
        const dbRef = db.collection('profiles').doc(message.author.id);

        // check if a profile already exists
        const profileDoc = await dbRef.get();

        if(!profileDoc.exists) {
            await Profile.create(message.author.id);
            embed.setTitle("New Profile");
            embed.setDescription(`${replyTo} a profile has been created for you.`);
            return await sendMessage(message, embed);
        } else {
            embed.setTitle("New Profile")
            embed.setDescription(`${replyTo} you already have a profile.`)
        }
    }
}
