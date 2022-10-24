package com.academia.health;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.IBinder;

import androidx.annotation.Nullable;

import androidx.core.content.ContextCompat;

import com.academia.health.utils.DayChangedBroadcastReceiver;
import com.academia.health.utils.SharedPrefManager;

import org.json.JSONException;

public class ForegroundService extends Service {
    private static final String CHANNEL_ID = "com.pedometer.weedoweb";
    private static final int FOREGROUND_ID = 945;

    private NotificationManager notificationManager;

    PedometerPluginImpl plugin;
    private final DayChangedBroadcastReceiver m_timeChangedReceiver =
            new DayChangedBroadcastReceiver() {
        @Override
        public void onDayChanged() {
            plugin.reset();
        }
    };

    @Override
    public void onCreate() {
        super.onCreate();

        notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        SharedPrefManager sharedPrefManager = new SharedPrefManager(this);

        plugin = PedometerPluginImpl.getInstance();
        plugin.initialize(this);
        plugin.start();

        plugin.listenerForService = data -> {
            try {
                int steps = ((Double) data.get("numberOfSteps")).intValue();
                sharedPrefManager.saveSteps(steps);
                sharedPrefManager.save(String.valueOf(data));
                updateContent(String.valueOf(steps));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        };

        registerReceiver(m_timeChangedReceiver, DayChangedBroadcastReceiver.getIntentFilter());
    }

    public static void startService(Context context, String message) {
        Intent intent = new Intent(context, ForegroundService.class);
        intent.putExtra("numberOfSteps", message);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            ContextCompat.startForegroundService(context, intent);
        } else {
            context.startService(intent);
        }
    }

    public static void stopService(Context context) {
        Intent intent = new Intent(context, ForegroundService.class);
        context.stopService(intent);
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        String input = intent.getStringExtra("numberOfSteps");
        createNotificationChannel();

        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this,
                0, notificationIntent, PendingIntent.FLAG_IMMUTABLE);

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            Notification.Builder notificationBuilder = new Notification.Builder(this, CHANNEL_ID)
                    .setContentTitle("Пройдено шагов сегодня:")
                    .setContentText(input)
                    .setSmallIcon(R.drawable.common_full_open_on_phone)
                    .setContentIntent(pendingIntent);

            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
                notificationBuilder.setForegroundServiceBehavior(Notification.FOREGROUND_SERVICE_IMMEDIATE);
            }

            startForeground(FOREGROUND_ID, notificationBuilder.build());
        }
        // do heavy work on a background thread
        // stopSelf();
        return START_STICKY;
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, "Пройдено шагов сегодня: ", NotificationManager.IMPORTANCE_DEFAULT);
            channel.enableVibration(false);
            channel.setSound(null, null);
            channel.setShowBadge(false);
            notificationManager.createNotificationChannel(channel);
        }
    }

    public void updateContent(String message) {
        PendingIntent pendingIntent = PendingIntent.getActivity(this,
                0, new Intent(this, MainActivity.class),
                PendingIntent.FLAG_IMMUTABLE);

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            Notification.Builder notificationBuilder = new Notification.Builder(this, CHANNEL_ID)
                    .setContentTitle("Пройдено шагов сегодня: ")
                    .setContentText(message)
                    .setSmallIcon(R.drawable.common_full_open_on_phone)
                    .setContentIntent(pendingIntent);

            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.S) {
                notificationBuilder.setForegroundServiceBehavior(Notification.FOREGROUND_SERVICE_IMMEDIATE);
            }

            notificationManager.notify(FOREGROUND_ID, notificationBuilder.build());
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        unregisterReceiver(m_timeChangedReceiver);
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
