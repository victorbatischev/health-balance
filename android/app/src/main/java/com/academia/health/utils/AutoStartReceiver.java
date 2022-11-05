package com.academia.health.utils;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

import com.academia.health.ForegroundService;

public class AutoStartReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context context, Intent intent) {
        SharedPrefManager manager = new SharedPrefManager(context);
        String message = manager.getLastNumberOfSteps()+"";
        ForegroundService.startService(context, message);
    }
}
