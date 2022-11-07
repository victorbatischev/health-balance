package com.academia.health.utils;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.util.Log;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public abstract class DayChangedBroadcastReceiver extends BroadcastReceiver {
    private Date date = new Date();
    private final DateFormat dateFormat = new SimpleDateFormat(
            "yyMMdd", Locale.getDefault());

    public abstract void onDayChanged();

    @Override
    public void onReceive(Context context, Intent intent) {
        String action = intent.getAction();
        Date currentDate = new Date();

        if (action != null && !isSameDay(currentDate) &&
                (action.equals(Intent.ACTION_DATE_CHANGED))) {
            date = currentDate;

            onDayChanged();
        }
    }

    private boolean isSameDay(Date currentDate) {
        return dateFormat.format(currentDate).equals(dateFormat.format(date));
    }

    public static IntentFilter getIntentFilter() {
        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(Intent.ACTION_DATE_CHANGED);
        return intentFilter;
    }
}
