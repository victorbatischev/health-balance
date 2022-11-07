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
import android.os.PowerManager;

import androidx.annotation.Nullable;

import androidx.core.content.ContextCompat;

import com.academia.health.utils.DayChangedBroadcastReceiver;
import com.academia.health.utils.PedometerWorker;
import com.academia.health.utils.SharedPrefManager;

import org.json.JSONException;

public class ForegroundService extends Service {
    private static final String CHANNEL_ID = "com.pedometer.weedoweb";
    private static final int FOREGROUND_ID = 945;

    private static NotificationManager notificationManager;
    private static Context mContext;

    PedometerPluginImpl plugin;
    private final DayChangedBroadcastReceiver m_timeChangedReceiver =
            new DayChangedBroadcastReceiver() {
        @Override
        public void onDayChanged() {
            if (plugin == null) { return; }
            plugin.reset();
        }
    };

    private PowerManager.WakeLock wakeLock;
    private String TAG = ForegroundService.class.toString();

    private static Boolean isServiceRunning = false;

    @Override
    public void onCreate() {
        super.onCreate();

        isServiceRunning = true;

        mContext = this;
        notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        SharedPrefManager sharedPrefManager = new SharedPrefManager(this);

        plugin = PedometerPluginImpl.getInstance();
        plugin.initialize(this);
        plugin.start();

        plugin.listenerForService = data -> {
            if (sharedPrefManager.isNotSameDay()) {
                plugin.reset();
                return;
            }

            int steps = 0;
            try {
                steps = data.getInt("numberOfSteps");
            } catch (JSONException e) {
                e.printStackTrace();
            }

            sharedPrefManager.save(String.valueOf(data));
            updateContent(String.valueOf(steps));

        };

        registerReceiver(m_timeChangedReceiver, DayChangedBroadcastReceiver.getIntentFilter());
    }

    public static void startService(Context context, String message) {
        if (isServiceRunning) {
            updateContent(message);
            return;
        }

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
        isServiceRunning = false;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        startWakeLock();
        String input = "Предоставьте разрешение на физическую активность и снова откройте приложение!";
        if (intent != null) {
            input = intent.getStringExtra("numberOfSteps");
        }

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

    private static void updateContent(String message) {
        PendingIntent pendingIntent = PendingIntent.getActivity(mContext,
                0, new Intent(mContext, MainActivity.class),
                PendingIntent.FLAG_IMMUTABLE);

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            Notification.Builder notificationBuilder = new Notification.Builder(mContext, CHANNEL_ID)
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

    private void startWakeLock() {
        PowerManager powerManager = (PowerManager) getSystemService(POWER_SERVICE);
        wakeLock = powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, TAG);
        // you must acquire a wake lock in order to keep the service going
        // android studio will complain that it does not like the wake lock not to have an ending time
        // but that is exactly what we need a permanent wake lock - we are implementing a never
        // ending service!
        if (wakeLock != null) {
            wakeLock.acquire();
        }
    }

    @Override
    public void onDestroy() {
        stopForeground(true);
        isServiceRunning = false;
        mContext = null;
        // call MyReceiver which will restart this service via a worker
        Intent broadcastIntent = new Intent(this, PedometerWorker.class);
        sendBroadcast(broadcastIntent);

        super.onDestroy();
        unregisterReceiver(m_timeChangedReceiver);
        if (wakeLock != null) {
            wakeLock.release();
        }
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
