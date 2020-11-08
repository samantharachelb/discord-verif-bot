import { Client, Command, CommandMessage, Description } from '@typeit/discord';
import sendMessage from "@utils/sendMessage"
import newEmbed from "@utils/embeds";

export abstract class Help {
    @Description("displays command help information")
    @Command("help :cmdName")
    async help(message: CommandMessage) {
        const cmdName = message.args.cmdName;
        const embed = newEmbed(message)
        const commandDict: any = {};
        Client.getCommands().forEach((item: any) => {
            commandDict[item.commandName.split(" ")[0]] = item.description || "";
        });

        if (cmdName) {
            embed.setTitle(`Help | ${message.prefix}${cmdName}`)
        } else {
            embed.setTitle("Help");
            let commandList = "";
            for (const item in commandDict) {
                const commandName = `\`${item}\`\t`;
                commandList = commandList + commandName
            }
            embed.addField("Available Commands", `${commandList}`);
        }

        await sendMessage(message, embed, false);
    }
}
