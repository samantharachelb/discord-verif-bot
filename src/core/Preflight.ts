import admin from 'firebase-admin';
import Config from "@src/core/Config";
import Firebase from "@src/core/cloud/Firebase";
import { Constants } from "@src/core/Constants";

export abstract class Preflight {

    static loadConfig(): void {
        Config.loadConfigFiles();
        Config.loadConfigVars();
    }

    static setVars(): void {
        Constants.getVersion();
    }

    static initFirebase(): void {
        Firebase.firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(Config.firebaseServiceAccount),
            storageBucket: `${Config.firebaseProjectId}.appspot.com`
        })
        Firebase.bucket = admin.storage().bucket();
        Firebase.datastore = admin.firestore();
    }
}
