import { CommandMessage } from "@typeit/discord";
const logger = require('@src/core/Log').Log.logger;
const jsonQuery = require('json-query');

export default abstract class ChannelScreen {
    static checkExists(requiredChannel: String, message: CommandMessage): string {
        if (!message.guild?.channels.cache.find(channel => channel.name.toLowerCase() === requiredChannel)) {
            logger.info(`Could not find verification channel for user ${message.author.id}!`);
            return "missingChannel";
        } else {
            logger.info(`Verification Channel for user ${message.author.id} found!`);
            return "channelFound" ;
        }
    }

    static async checkRightChannel(requiredChannel: String, message: CommandMessage): Promise<string> {
        const currentChannelId = message.channel.id;
        if (!message.guild?.channels.cache.find(channel => channel.name === requiredChannel)) {
            return "missingChannel";
        } else {
            const requiredChannelId = await this.getChannelId(requiredChannel, message);
            if (currentChannelId !== requiredChannelId) {
                return "incorrectChannel";
            } else {
                return "correctChannel";
            }
        }
    }

    static async getChannelId(reqChannel: String, message: CommandMessage): Promise<string> {
        return jsonQuery('[id]', {
            data: message.guild?.channels.cache.find(
                channel => channel.name === reqChannel
            )
        }).value;
    }
}
