/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendNotification = functions.firestore
  .document('chats/{chatId}/messages/{messageId}')
  .onCreate(async (snap, context) => {
    const messageData = snap.data();
    const chatId = context.params.chatId;

    const chatRef = admin.firestore().collection('chats').doc(chatId);
    const chatDoc = await chatRef.get();
    const participants = chatDoc.data().participants;

    const senderId = messageData.userId;
    const recipientId = participants.find(id => id !== senderId);

    const recipientRef = admin.firestore().collection('profiles').doc(recipientId);
    const recipientDoc = await recipientRef.get();
    const recipientFcmToken = recipientDoc.data().fcmToken;

    if (recipientFcmToken) {
      const payload = {
        notification: {
          title: 'New Message',
          body: messageData.text || 'You have a new message',
          sound: 'default',
        },
        data: {
          chatId,
        },
      };

      try {
        await admin.messaging().sendToDevice(recipientFcmToken, payload);
        console.log('Notification sent successfully');
      } catch (error) {
        console.error('Error sending notification:', error);
      }
    }
  });



// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
