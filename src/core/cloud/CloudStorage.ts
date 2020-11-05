import Firebase from '@src/core/Cloud/Firebase';
import { Storage } from '@google-cloud/storage';
const logger = require('@src/core/Log').Log.logger;

export default abstract class CloudStorage {
    static storageClient = new Storage();
    static storageBucket = Firebase.bucket;
    static async uploadFile(pathToFile: string): Promise<void> {
        await this.storageBucket.upload(pathToFile, {
            gzip: true,
            predefinedAcl: "private"
        });
        logger.info(`${pathToFile} uploaded to ${this.storageBucket.name}`);
    }
}
