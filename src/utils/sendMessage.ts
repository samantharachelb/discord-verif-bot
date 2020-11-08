import Config from "@src/core/Config";
const logger = require("@src/core/Log").Log.logger;

/**
 * Helper function for sending messages
 * @param message [Discord message object]
 * @param content [the message that is to be sent. can be text or an embed]
 * @param {[boolean]} deleteMessage [Delete the message sent by the bot. Defaults to the option set in bot configuration]
 * @param {[boolean]} deleteInvokingCommand [Delete the invoking message/command. Defaults to the option set in bot configuration]
 */
export default async function sendMessage(
    message: any,
    content: any,
    deleteMessage: boolean = Config.botDeleteMessages,
    deleteInvokingCommand: boolean = Config.botDeleteCommands
) {

    message.channel.send(content)
        .then((msg: any) => {
            if (deleteMessage)
                msg.delete({timeout: Config.botMessageTimeout})

            if (deleteInvokingCommand)
                message.delete({timeout: Config.botMessageTimeout}); // deletes the previous message
        })
        .catch((err: any) => {
            logger.error("Could not send message!");
            logger.error(err.toString());
        })
}
