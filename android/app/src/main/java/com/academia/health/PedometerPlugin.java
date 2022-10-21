package com.academia.health;

import android.Manifest;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.core.content.ContextCompat;

import com.academia.health.utils.SharedPrefManager;
import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import org.json.JSONException;

@NativePlugin(
        name = "PedometerPlugin",
        permissions = { Manifest.permission.ACTIVITY_RECOGNITION }
)
public class PedometerPlugin extends Plugin {

    private PedometerPluginImpl plugin;
    private ActivityResultLauncher<String> requestPermissionLauncher;

    @Override
    public void load() {
        super.load();

        requestPermissionLauncher =
                getActivity().registerForActivityResult(new ActivityResultContracts
                        .RequestPermission(), isGranted -> {
                    if (isGranted) {
                        plugin.start();
                    }
                });

        plugin = PedometerPluginImpl.getInstance();
        plugin.initialize(getContext());
        plugin.listener = data -> {
            bridge.triggerJSEvent("stepEvent", "window", String.valueOf(data));

            try {
                ForegroundService.startService(getContext(),
                        String.valueOf(((Double) data.get("numberOfSteps")).intValue()));
            } catch (JSONException e) {
                e.printStackTrace();
            };
        };
    }

    @Override
    protected void handleOnDestroy() {
        super.handleOnDestroy();
    }

    @PluginMethod
    public void getSavedData(PluginCall call) {
        SharedPrefManager manager = new SharedPrefManager(getContext());
        String savedData = manager.getData();
        if (savedData == null) {
            JSObject data = plugin.getStepsJSON(0);
            call.resolve(data);
            return;
        }
        try {
            call.resolve(new JSObject(savedData));
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @PluginMethod
    public void setData(PluginCall call) {
        SharedPrefManager manager = new SharedPrefManager(getContext());
        int stepsFromIonic = call.getInt("numberOfSteps");
        manager.saveSteps(stepsFromIonic);
        plugin.lastNumberOfSteps = stepsFromIonic;
    }

    @PluginMethod
    public void start(PluginCall call) {
        call.resolve();
        SharedPrefManager sharedPrefManager = new SharedPrefManager(getContext());
        String lastSavedSteps = String.valueOf(sharedPrefManager.getLastNumberOfSteps());
        ForegroundService.startService(getContext(), lastSavedSteps);

        if(ContextCompat.checkSelfPermission(getActivity(),
                android.Manifest.permission.ACTIVITY_RECOGNITION) ==
                android.content.pm.PackageManager.PERMISSION_DENIED){
            // ask for permission
            requestPermissionLauncher.launch(android.Manifest.permission.ACTIVITY_RECOGNITION);
        } else {
            plugin.start();
        }
    }

    @PluginMethod
    public void stop() {
        plugin.stop();
        ForegroundService.stopService(getContext());
    }

    @PluginMethod
    public void reset() {
        plugin.reset();
    }
}
