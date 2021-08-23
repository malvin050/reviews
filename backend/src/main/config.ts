import admin from "firebase-admin";

const inProduction = process.env.NODE_ENV === "production";
const inStaging = process.env.NODE_ENV === "staging";

if (!(inProduction || inStaging)) {
  require("dotenv").config();
}

const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH!);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
admin.firestore().settings({ ignoreUndefinedProperties: true });
