import fs from 'fs';
import path from 'path';
import forceExit from "@src/core/forceExit";
import { FileNotFoundError, ConfigError } from "@src/core/Errors";
const logger = require("@src/core/Log").Log.logger;

export default abstract class Config {
    static config: { [p: string]: any} = [];
    static configDir = path.join(process.cwd(), "config");
    static localeData: any;

    // Firebase Stuff
    static firebaseServiceAccount: any;
    static firebaseServiceAccountFileName = "serviceAccountKey.json";
    static firebaseServiceAccountFilePath = path.join(Config.configDir, Config.firebaseServiceAccountFileName)
    static firebaseProjectId = "shitty-discord-bots";

    // Bot - Authentication
    static botToken: string; // discord bot token

    // Bot - Permissions
    static botOwner: string; // single ID for owner user
    static botAdminRoles: string[] = []; // array of IDs of admin/mod roles

    // Bot - Chat Options
    static botPrefix: string;
    static botAdminChannel: string;
    static botVerificationChannel: string;

    // Bot - Core Options
    static botDeleteMessages: boolean;
    static botDeleteCommands: boolean;
    static botMessageTimeout: number;
    static botLanguage: string;

    static loadConfigFiles(): void {
        // check for GCP service account key
        if(!fs.existsSync(this.firebaseServiceAccountFilePath)) {
            const errorMessage = new FileNotFoundError(
                `Could not find any GCP Service Account Key named: ${this.firebaseServiceAccountFileName}`
            );
            return forceExit(errorMessage.toString())
        } else {
            this.firebaseServiceAccount = this.firebaseServiceAccountFilePath;
        }
    }

    static loadConfigVars(): void {
        // authentication
        if (process.env.BOT_TOKEN !== undefined) {
            this.botToken = process.env.BOT_TOKEN;
        } else {
            forceExit(new ConfigError("Missing Bot Token").toString());
        }

        // permissions
        this.botOwner = process.env.BOT_OWNER || "auto";

        if (process.env.BOT_ADMIN_ROLES?.match(/\d*\s\d*/g)) {
            const roles = process.env.BOT_ADMIN_ROLES.split(" ");
            for (let index = 0; index < roles.length; index++) {
                this.botAdminRoles.push(roles[index]);
            }
        } else if (!process.env.BOT_ADMIN_ROLES) {
            forceExit(new ConfigError("Missing Admin Roles").toString());
        } else {
            this.botAdminRoles[0] = process.env.BOT_ADMIN_ROLES
        }

        // chat
        this.botPrefix = process.env.BOT_PREFIX || "vf;";
        if (process.env.BOT_ADMIN_CHANNEL) {
            this.botAdminChannel = process.env.BOT_ADMIN_CHANNEL;
        } else {
            forceExit(new ConfigError("Missing Admin Channel").toString());
        }

        if (process.env.BOT_VERIFICATION_CHANNEL) {
            this.botVerificationChannel = process.env.BOT_VERIFICATION_CHANNEL
        } else {
            forceExit(new ConfigError("Missing Verification Channel").toString());
        }

        // core
        this.botDeleteMessages = this.convToBool(process.env.BOT_DELETE_MESSAGES) || true;
        this.botDeleteCommands = this.convToBool(process.env.BOT_DELETE_COMMANDS) || true;

        if (process.env.BOT_MESSAGE_TIMEOUT === undefined) {
            this.botMessageTimeout = 15 * 1000;
        } else {
            this.botMessageTimeout = parseInt(process.env.BOT_MESSAGE_TIMEOUT) * 1000;
        }

        this.botLanguage = process.env.BOT_LANGUAGE || "en_CA";

        logger.debug(`Bot Token: ${this.botToken}`);
        logger.debug(`Bot Owner: ${this.botOwner}`);
        logger.debug(`Admin Roles: ${this.botAdminRoles}`);
        logger.debug(`Admin Channel: ${this.botAdminChannel}`);

    }

    static convToBool(value: string | undefined): boolean | undefined{
        switch(value) {
            case "yes":
                return true;
            case "no":
                return true;
            default:
                break;
        }
    }
}
