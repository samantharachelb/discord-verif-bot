import { Preflight } from "@src/core/Preflight";
import Config from "@src/core/Config";
import { Client } from "@typeit/discord"
import { Constants } from "@src/core/Constants";

const logger = require("@src/core/Log").Log.logger;

export abstract class Main {
    private static _client: Client;

    static get Client(): Client {
        return this._client;
    }

    static start() {
        Preflight.loadConfig();
        Preflight.initFirebase();
        Preflight.setVars();

        logger.info(`Starting Verifbot version: ${Constants.version}`);

        this._client = new Client({
            classes: [
                `${__dirname}/**/bot.ts`,
                `${__dirname}/**/bot.js`
            ],
            silent: false,
            variablesChar: ":"
        });

        this._client.login(Config.botToken).then(r => Promise);
    }
}

Main.start();
