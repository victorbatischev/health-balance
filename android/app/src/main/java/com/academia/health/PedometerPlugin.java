package com.academia.health;

import android.Manifest;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import java.util.Timer;
import java.util.TimerTask;


@NativePlugin(
        name = "PedometerPlugin",
        permissions = { @Permission(alias = "activity", strings = {Manifest.permission.ACTIVITY_RECOGNITION}) }
)
public class PedometerPlugin extends Plugin {

    @Override
    public void load() {
        super.load();
    }

    @Override
    protected void handleOnDestroy() {
        super.handleOnDestroy();
    }

    @PluginMethod
    public void start(PluginCall call) {
        call.resolve();
        if(ContextCompat.checkSelfPermission(getActivity(),
                android.Manifest.permission.ACTIVITY_RECOGNITION) == android.content.pm.PackageManager.PERMISSION_DENIED){
            //ask for permission
            ActivityCompat.requestPermissions(getActivity(), new String[]{android.Manifest.permission.ACTIVITY_RECOGNITION}, 1);
        }

        ForegroundService.startService(getContext(), "0");
    }

    @PluginMethod
    public void stop() {
        ForegroundService.stopService(getContext());
    }
}