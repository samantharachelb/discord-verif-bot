const admin = require('firebase-admin');
import fs from 'fs';
import Config from '@src/core/config';

export default abstract class Firebase {
    static serviceAccount;
    static errorMessage: string;
    static initialize() {
        if (!fs.existsSync(Config.configDir)) {
            this.errorMessage = "Could not find config file directory"
            return;
        }

        try {
            fs.readFileSync(Config.serviceAccountFile)
        }
    }
}
