import fs from 'fs';
import path from 'path';
import forceExit from "@src/core/forceExit";
const logger = require("@src/core/Log").Log.logger;

export default abstract class Config {
    static config: { [p: string]: any} = [];
    static configDir = path.join(process.cwd(), "config");
    static configFile = path.join(Config.configDir, "config.toml");
    static errorMessage: string;

    // Google Cloud Stuff
    static gcpServiceAccount: any; // GCP service account token/file
    static gcpProjectId: string; // GCP Project Identifier

    // Bot - Authentication
    static botToken: string; // discord bot token

    // Bot - Permissions
    static botOwner: string; // single ID for owner user
    static botDevs: string[] = []; // array of IDs for dev users
    static botAdmins: string[] = []; // array of IDs for admin users

    // Bot - Chat Options
    static botPrefix: string;
    static botAdminChannel: string;
    static botVerificationChannel: string;

    // Bot - Core Options
    static botDeleteMessages: boolean;
    static botDeleteCommands: boolean;
    static botMessageTimeout: number;

    static initialize(): void {
        // check for config file directory
        if (!fs.existsSync(this.configDir)) {
            logger.warn("Couldn't find a configuration directory. Falling back to environment variables")

        }
    }

    static loadConfigFile(): void {

    }

    static loadConfigVars(): void {

    }
}
