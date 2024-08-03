const SibApiV3Sdk = require('sib-api-v3-sdk');

/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const { onRequest } = require('firebase-functions/v2/https');
// const logger = require('firebase-functions/logger');

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require('firebase-functions');
const BREVO_API_KEY = functions.config().brevo.api_key;
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendReminderEmail = functions.pubsub
    .schedule('every 24 hours')
    .onRun(async (context) => {
        const now = admin.firestore.Timestamp.now();
        const remindersSnapshot = await admin
            .firestore()
            .collection('reminders')
            .where('replacementDate', '<=', now)
            .get();

        const sendEmailPromises = remindersSnapshot.docs.map(async (doc) => {
            const reminderData = doc.data();
            const defaultClient = SibApiV3Sdk.ApiClient.instance;
            const apiKey = defaultClient.authentications['api-key'];
            apiKey.apiKey = BREVO_API_KEY;

            const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
            const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

            sendSmtpEmail.subject = 'Your Water Filter Needs Replacing';
            sendSmtpEmail.htmlContent = `<html>
        <body><h1>Time to Replace Your Water Filter</h1>
        <p>Your water filter is due for a replacement. 
        Don't forget to change it to ensure clean, fresh water!</p>
        </body></html>`;
            sendSmtpEmail.sender = {
                name: 'HydroFilter Reminder',
                email: 'noreply@yourapp.com',
            };
            sendSmtpEmail.to = [{ email: reminderData.email }];

            try {
                const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
                console.log(
                    'Email sent successfully. Returned data: ' +
                        JSON.stringify(data)
                );
            } catch (error) {
                console.error('Error sending email:', error);
            }
            console.log(`Sending reminder email to ${reminderData.email}`);
        });

        await Promise.all(sendEmailPromises);
    });
