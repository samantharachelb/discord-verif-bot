import Locale from "@src/core/Locale";

const jsonQuery = require('json-query');
import Config from '@src/core/Config';
import newEmbed from "@utils/embeds";
import sendMessage from "@utils/sendMessage";

export abstract class Permissions {
    static checkAdmin(message: any) {
        // extract roles
        const userRoles = jsonQuery('id', { data: message.member?.roles?.cache.array()}).value;

        // check for intersecting values
        // array1 = [1, 2, 3, 4, 5, 6]
        // array2 = [2, 3, 5]
        // result => [2, 3, 5
        const validate = userRoles.filter((x: any) => Config.botAdminRoles.includes(x));

        return validate.length !== 0;
    }

    static async checkFailed(message: any) {
        const embed = newEmbed(message);
        const replyTo = `<@${message.author.id}>`
        const genericLocaleStrings = Locale.localeData.generics;
        embed.setTitle(`${genericLocaleStrings['no-permission']}`)
        embed.setDescription(`${replyTo}\n I'm sorry Dave, I can't let you do that.`);
        embed.setColor(10027008)

        await sendMessage(message, embed);
    }
}
