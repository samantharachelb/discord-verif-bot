import fs from 'fs';
import path from 'path';
import forceExit from "@src/core/forceExit";
const logger = require("@src/core/Log").Log.logger;

export default abstract class Locale {
    static locale: any;
    static localeData: any;
    static languageFile: string;


    static loadLocalizationDataFile(language: string): void {
        this.languageFile = path.join(process.cwd(), "config", "i18n", `${language}.json`);

        if(!fs.existsSync(this.languageFile)) {
            logger.warn(`Could not find localization data for locale: ${language}. Falling back to default (en_CA)`);
            this.languageFile = path.join(process.cwd(), "config", "i18n", 'en_CA.json');
        }
        this.localeData = JSON.parse(fs.readFileSync(this.languageFile, {
            encoding: "utf8"
        }));
        logger.debug({data: this.localeData});
    }
}
