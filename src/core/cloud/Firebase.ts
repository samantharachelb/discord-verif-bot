import admin from 'firebase-admin';
import Config from '@src/core/Config';


export default abstract class Firebase {
    static firebaseApp = admin.initializeApp({
        credential: admin.credential.cert(Config.firebaseServiceAccount),
        storageBucket: `${Config.firebaseProjectId}.appspot.com`
    })
    static bucket = admin.storage().bucket();
    static datastore = admin.firestore();
}
