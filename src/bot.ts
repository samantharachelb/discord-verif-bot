import { Client, Discord, On, ArgsOf } from "@typeit/discord";
import "reflect-metadata";
import path from "path";
import Config from "@src/core/Config";
const logger = require("@src/core/Log").Log.logger;
import { Permissions } from "@src/core/Permissions";
import { Profile } from "@src/core/Profile";
import HCommands from "@src/helpers/HCommands"

@Discord(Config.botPrefix, {
    import: [
        path.join(__dirname, 'commands/**', "*.ts"),
        path.join(__dirname, 'commands/**', "*.js")
    ]
})
export abstract class Bot {
    private dogstatsd: any;

    @On('ready')
    async onReady(args: string[], bot: Record<string, any>, client: Client): Promise<void> {
        logger.debug(`bot type: ${typeof bot}`);
        logger.info(`Logged in as ${bot.user.tag}`);
        // Client.getCommands().forEach((element: any) => {
        //     logger.info(`Loaded command: ${element.commandName}`);
        // })

        bot.user.setActivity(`${Config.botPrefix}help`, {
            type: "LISTENING"
        });

        HCommands.indexCommands();
    }

    @On("guildMemberAdd")
    async onGuildMemberAdd([member]: ArgsOf<"guildMemberAdd">) {
        console.log("a new member has joined");
        await Profile.create(member.id);
    }

    @On("guildMemberRemove")
    async onGuildMemberRemove([member]: ArgsOf<"guildMemberRemove">) {
        await Profile.remove(member.id);
    }

    @On("message")
    async onMessage([message]: ArgsOf<"message">, client: Client): Promise<void> {
        if (message.author.bot)
            return;

        if (message.content.startsWith(Config.botPrefix)) {
            return
        }

        Permissions.checkAdmin(message);
    }
}
