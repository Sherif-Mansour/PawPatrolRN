package com.pawpatrolrn

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.util.Log
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage
import com.sendbird.android.SendBird
import org.json.JSONException
import org.json.JSONObject

class MyFirebaseMessagingService : FirebaseMessagingService() {

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        Log.d("MyFirebaseMsgService", "New token: $token")
        SendBird.registerPushTokenForCurrentUser(token, SendBird.RegisterPushTokenWithStatusHandler { status, e ->
            if (e != null) {
                Log.e("MyFirebaseMsgService", "Error registering token: ${e.message}")
            }
            if (status == SendBird.PushTokenRegistrationStatus.PENDING) {
                Log.d("MyFirebaseMsgService", "Push token registration is pending")
            }
        })
    }

    override fun onMessageReceived(remoteMessage: RemoteMessage) {
        Log.d("MyFirebaseMsgService", "Message received from: ${remoteMessage.from}")
        try {
            if (remoteMessage.data.containsKey("sendbird")) {
                val sendbird = JSONObject(remoteMessage.data["sendbird"])
                Log.d("MyFirebaseMsgService", "Sendbird payload: $sendbird")
                
                val channel = sendbird.getJSONObject("channel")
                val channelUrl = channel.getString("channel_url")
                
                val sender = sendbird.getJSONObject("sender")
                val senderName = sender.getString("name")
                Log.d("MyFirebaseMsgService", "Sender name: $senderName")
                
                val messageTitle = senderName
                val messageBody = sendbird.getString("message")

                Log.d("MyFirebaseMsgService", "Parsed message: $messageTitle - $messageBody")
                sendNotification(applicationContext, messageTitle, messageBody, channelUrl)
            } else {
                Log.d("MyFirebaseMsgService", "No Sendbird data found in the message")
            }
        } catch (e: JSONException) {
            Log.e("MyFirebaseMsgService", "JSON parsing error: ${e.message}")
            e.printStackTrace()
        }
    }

    private fun sendNotification(context: Context, messageTitle: String, messageBody: String, channelUrl: String) {
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val channelId = "sendbird_channel"
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            val channel = NotificationChannel(channelId, "Sendbird Notifications", NotificationManager.IMPORTANCE_HIGH)
            channel.description = "Sendbird Notifications"
            channel.enableLights(true)
            channel.lightColor = Color.BLUE
            notificationManager.createNotificationChannel(channel)
        }

        val intent = Intent(context, MainActivity::class.java)
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP)
        val pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_ONE_SHOT)

        val notificationBuilder = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(messageTitle)
            .setContentText(messageBody)
            .setAutoCancel(true)
            .setSound(android.provider.Settings.System.DEFAULT_NOTIFICATION_URI)
            .setContentIntent(pendingIntent)

        notificationManager.notify(0, notificationBuilder.build())
        Log.d("MyFirebaseMsgService", "Notification sent: $messageTitle - $messageBody")
    }
}
