package com.academia.health;

import android.Manifest;

import androidx.core.content.ContextCompat;

import com.academia.health.utils.SharedPrefManager;
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
                getActivity().registerForActivityResult(new ActivityResultContracts.RequestPermission(), isGranted -> {
                    if (isGranted) {
                        plugin.start();
                    } else {
                        // Explain to the user that the feature is unavailable because the
                        // features requires a permission that the user has denied. At the
                        // same time, respect the user's decision. Don't link to system
                        // settings in an effort to convince the user to change their
                        // decision.
                    }
                });

        SharedPrefManager manager = new SharedPrefManager(getContext());
        String savedData = manager.getData();

        if (savedData != null) {
            bridge.triggerJSEvent("stepEvent", "window", String.valueOf(savedData));
        }

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
