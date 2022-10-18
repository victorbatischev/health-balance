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

import com.academia.health.utils.SharedPrefManager;

import org.json.JSONException;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

public class ForegroundService extends Service {
    private static final String CHANNEL_ID = "com.pedometer.weedoweb";
    private static final int FOREGROUND_ID = 945;

    private NotificationManager notificationManager;

    @Override
    public void onCreate() {
        super.onCreate();

        notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        SharedPrefManager sharedPrefManager = new SharedPrefManager(this);

        PedometerPluginImpl plugin = PedometerPluginImpl.getInstance();
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

        ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);
        long midnight = LocalDateTime.now().until(LocalDate.now().plusDays(1).atStartOfDay(),
                ChronoUnit.MINUTES);
        Runnable runnable = () -> {
            plugin.reset();
            plugin.start();
        };

        scheduler.scheduleAtFixedRate(runnable, midnight, TimeUnit.DAYS.toMinutes(1), TimeUnit.MINUTES);
    }

    public static void startService(Context context, String message) {
        Intent intent = new Intent(context, ForegroundService.class);
        intent.putExtra("numberOfSteps", message);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(intent);
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

        Notification notification = null;
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            notification = new Notification.Builder(this, CHANNEL_ID)
                    .setContentTitle("Пройдено шагов сегодня:")
                    .setContentText(input)
                    .setSmallIcon(R.drawable.common_full_open_on_phone)
                    .setContentIntent(pendingIntent)
                    .build();
        }

        startForeground(FOREGROUND_ID, notification);

        // do heavy work on a background thread
        // stopSelf();
        return START_STICKY;
    }


    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID,
                    "Пройдено шагов сегодня: ", NotificationManager.IMPORTANCE_HIGH);
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
            Notification notification = new Notification.Builder(this, CHANNEL_ID)
                    .setContentTitle("Пройдено шагов сегодня: ")
                    .setContentText(message)
                    .setSmallIcon(R.drawable.common_full_open_on_phone)
                    .setContentIntent(pendingIntent)
                    .build();

            notificationManager.notify(FOREGROUND_ID, notification);
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
