import { Command, CommandMessage, Description } from '@typeit/discord';
import sendMessage from "@utils/sendMessage"
import newEmbed from "@utils/embeds";
import { Permissions } from "@src/core/Permissions";
const logger = require("@src/core/Log").Log.logger;

export abstract class Cleanup {
    @Description("Cleans up a specified number of messages")
    @Command("cleanup :numMessages")
    async cleanup(message: CommandMessage) {
        const embed = newEmbed(message);
        const replyTo = `<@${message.author.id}>`
        const numMessages = message.args.numMessages;

        if (!Permissions.checkAdmin(message)) {
            embed.setTitle("Insufficient Permissions")
            embed.setDescription(`${replyTo}\n I'm sorry Dave, I can't let you do that.`);
            embed.setColor(10027008)
            logger.info(`User ${message.author.id} attempted to use a command that requires admin permissions`)
            return await sendMessage(message, embed);
        }

        if(!numMessages) {
            embed.setTitle("An error has occurred")
            embed.setDescription("You need to specify how many messages you want to delete!")
            embed.setColor(10027008)
            return await sendMessage(message, embed);
        } else {
            // @ts-ignore: it works fine
            message.channel.bulkDelete(numMessages + 1)
                .then(() => {
                    embed.setTitle("Cleaned up messages");
                    embed.setDescription(`${replyTo}\nCleaned up ${numMessages} messages`)
                    sendMessage(message, embed, true, false);
                }).catch((error: Error) => {
                    logger.error(error.toString());
                    embed.setTitle("An error has occurred");
                    embed.setDescription(`${replyTo} ${error.message}`);
                    embed.setColor(10027008)
                    sendMessage(message, embed);
            });
        }
    }
}
