package com.academia.health.utils;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import com.academia.health.ForegroundService;

public class PedometerWorker extends Worker {

    private final Context context;

    public PedometerWorker(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
        this.context = context;
    }

    @NonNull
    @Override
    public Result doWork() {
        SharedPrefManager manager = new SharedPrefManager(context);
        ForegroundService.startService(context, manager.getLastNumberOfSteps()+"");
        return Result.success();
    }

    @Override
    public void onStopped() {
        super.onStopped();
    }
}
