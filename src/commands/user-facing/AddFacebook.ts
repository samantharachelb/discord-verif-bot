import { Command, CommandMessage, Description, Infos } from "@typeit/discord";
import sendMessage from "@utils/sendMessage";
import newEmbed from "@utils/embeds";
import Firebase from "@src/core/cloud/Firebase";
import ChannelScreen from "@src/core/ChannelScreen";
import { Profile } from "@src/core/Profile";
import Locale from "@src/core/Locale";
import Config from "@src/core/Config";
import passport from "passport";
import strategy from "passport-facebook";


export default abstract class AddFacebook {
    @Command("addfacebook")
    @Infos({
        category: "verification",
        usage: "vf;addfacebook"
    })
    @Description("Allows the user to add their facebook account via the Facebook Login API")
    async addFacebook(message: CommandMessage) {
        const embed = newEmbed(message);
        const replyTo = `<@${message.author.id}>`;
        const db = Firebase.datastore;
        const dbRef = db.collection('profiles').doc(message.author.id);
        const errorStrings = Locale.localeData.generics;
        const commandStrings = Locale.localeData.commands.verification.addFacebook;
        const profileDoc = await dbRef.get();

        embed.setTitle("Add Facebook Profile")

        // check if the user has a profile first
        if(!profileDoc.exists) {
            embed.setDescription(`${replyTo} ${errorStrings['no-profile']} \`${Config.botPrefix}newprofile\``)
            return await sendMessage(message, embed);
        }

        // check if the user's profile is in "editing mode"
        if (ChannelScreen.checkExists(message.author.id, message) === "missingChannel") {
            embed.setDescription(`${replyTo} ${errorStrings['profile-not-open']} \`${Config.botPrefix}editprofile\``);
            return await sendMessage(message, embed);
        }

        // check if we're in the right channel
        if (await ChannelScreen.checkRightChannel(message.author.id, message) === "incorrectChannel") {
            const channelId = await ChannelScreen.getChannelId(message.author.id, message);
            embed.setDescription(`${replyTo} ${commandStrings['wrong-channel']} <#${channelId}>`)
            return await sendMessage(message, embed);
        }
    }
}
