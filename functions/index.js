const functions = require('firebase-functions');
const admin = require('firebase-admin');
const SibApiV3Sdk = require('sib-api-v3-sdk');

admin.initializeApp();

exports.sendReminderEmail = functions.pubsub
    .schedule('every 24 hours')
    .onRun(async (context) => {
        const defaultClient = SibApiV3Sdk.ApiClient.instance;
        const apiKey = defaultClient.authentications['api-key'];
        apiKey.apiKey = functions.config().brevo.api_key;

        const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
        const now = admin.firestore.Timestamp.now();

        const remindersSnapshot = await admin
            .firestore()
            .collection('reminders')
            .where('replacementDate', '<=', now)
            .get();

        const sendEmailPromises = remindersSnapshot.docs.map(async (doc) => {
            const reminderData = doc.data();
            const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

            sendSmtpEmail.to = [{ email: reminderData.email }];
            sendSmtpEmail.subject = 'Time to replace your water filter!';
            sendSmtpEmail.htmlContent = `<h1>Your ${
                reminderData.filterType
            } filter needs replacing</h1>      
        <p>You set up a reminder on 
        ${reminderData.startDate.toDate().toLocaleDateString()}. 
                                     It's time to replace your filter for
                                      clean, fresh water!</p>`;
            sendSmtpEmail.sender = {
                name: 'HydroFilter Reminder',
                email: 'kytwebsites@gmail.com',
            };

            try {
                const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
                console.log(
                    'Email sent successfully. Returned data: ' +
                        JSON.stringify(data)
                );
            } catch (error) {
                console.error('Error sending email:', error);
            }
        });

        await Promise.all(sendEmailPromises);
        return null;
    });

// const functions = require("firebase-functions");
// const admin = require("firebase-admin");
// const SibApiV3Sdk = require("sib-api-v3-sdk");

// admin.initializeApp();

// const defaultClient = SibApiV3Sdk.ApiClient.instance;
// const apiKey = defaultClient.authentications["api-key"];
// apiKey.apiKey = functions.config().brevo.api_key;

// exports.sendReminderEmail = functions.pubsub
//     .schedule("every 24 hours")
//     .onRun(async (context) => {
//       const now = admin.firestore.Timestamp.now();
//       const remindersSnapshot = await admin
//           .firestore()
//           .collection("reminders")
//           .where("replacementDate", "<=", now)
//           .get();

//       const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

//       const sendEmailPromises = remindersSnapshot.docs.map(async (doc) => {
//         const reminderData = doc.data();
//         const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

//         sendSmtpEmail.to = [{email: reminderData.email}];
//         sendSmtpEmail.subject = "Time to replace your water filter!";
//         sendSmtpEmail.htmlContent = `<h1>Your ${
//           reminderData.filterType
//         } filter needs replacing</h1>
//                                  <p>You set up a reminder on
//                                   ${reminderData.startDate
//       .toDate()
//       .toLocaleDateString()}.
//                                  It's time to replace
//                                  your filter for clean,
//                                  fresh water!</p>`;
//         sendSmtpEmail.sender = {
//           name: "HydroFilter Reminder",
//           email: "noreply@yourapp.com",
//         };

//         try {
//           const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
//           console.log(
//               `Email sent successfully to ${
//                 reminderData.email
//               }. Data: ${JSON.stringify(data)}`,
//           );
//         } catch (error) {
//           console.error(
//               `Failed to send email to ${reminderData.email}:`,
//               error,
//           );
//         }
//       });

//       await Promise.all(sendEmailPromises);
//       return null;
//     });
