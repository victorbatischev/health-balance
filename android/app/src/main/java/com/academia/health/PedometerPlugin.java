package com.academia.health;

import android.Manifest;
import android.app.admin.DevicePolicyManager;
import android.app.admin.SystemUpdatePolicy;
import android.content.ComponentName;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.ActivityResultRegistry;
import androidx.activity.result.contract.ActivityResultContract;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AlertDialog;
import androidx.core.app.ActivityOptionsCompat;
import androidx.core.content.ContextCompat;

import com.academia.health.utils.AdminManager;
import com.academia.health.utils.SharedPrefManager;
import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import org.json.JSONException;

@NativePlugin(
        name = "PedometerPlugin",
        permissions = { Manifest.permission.ACTIVITY_RECOGNITION, Manifest.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS }
)
public class PedometerPlugin extends Plugin {

    private PedometerPluginImpl plugin;
    private ActivityResultLauncher<String> requestPermissionLauncher;

    private Boolean isDialogPresent = false;
    private Boolean isStartInvoked = false;

    private DevicePolicyManager deviceManger;
    private ComponentName compName;

    @Override
    public void load() {
        super.load();

        compName = new ComponentName(getActivity(), AdminManager.class);
        deviceManger = (DevicePolicyManager) getContext().getSystemService(
                Context.DEVICE_POLICY_SERVICE);

        if(deviceManger.isDeviceOwnerApp(getContext().getPackageName())){
//            setDefaultCosuPolicies(true);
        } else {
            Log.e("TAG","This application not whitelisted");
        }

        requestPermissionLauncher =
                getActivity().registerForActivityResult(new ActivityResultContracts
                        .RequestPermission(), isGranted -> {
                    if (isGranted) {

                    } else {
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                            askPermission();
                        }
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

        isDialogPresent = false;
        isStartInvoked = false;
    }

    @Override
    protected void handleOnStart() {
        super.handleOnStart();
        if (isStartInvoked) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                askPermission();
            }
        }
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
        start(call);
        call.resolve();
    }

    @PluginMethod
    public void start(PluginCall call) {
        askDeviceAdmin();
        isStartInvoked = true;
        askBatteryOptPermission();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            askPermission();
        }
    }

    @PluginMethod
    public void stop(PluginCall call) {
        plugin.stop();
        ForegroundService.stopService(getContext());
        call.resolve();
    }

    @PluginMethod
    public void reset(PluginCall call) {
        plugin.reset();
        call.resolve();
    }

    @PluginMethod
    public void requestPermission(PluginCall call) {
        requestPermissionLauncher.launch(android.Manifest.permission.ACTIVITY_RECOGNITION);
        call.resolve();
    }

    @RequiresApi(api = Build.VERSION_CODES.M)
    private void askPermission() {
        if(ContextCompat.checkSelfPermission(getActivity(),
                android.Manifest.permission.ACTIVITY_RECOGNITION) ==
                PackageManager.PERMISSION_GRANTED) {
            startExecution();
        } else if (getActivity().shouldShowRequestPermissionRationale(android.Manifest.permission.ACTIVITY_RECOGNITION)) {
            requestPermissionLauncher.launch(android.Manifest.permission.ACTIVITY_RECOGNITION);
        } else {
            showSettingsDialog();
        }
    }

    private void showSettingsDialog() {
        if (isDialogPresent) return;
        AlertDialog.Builder builder = new AlertDialog.Builder(getContext());
        builder.setCancelable(false);
        builder.setTitle("Необходимо разрешение");
        builder.setMessage("Вы должны разрешить физическую активность для использования этого приложения");
        builder.setPositiveButton("Настройки", (dialog, which) -> {
            openSettings();
            isDialogPresent = false;
        });
        builder.create().show();
        isDialogPresent = true;
    }

    private void openSettings() {
        Intent intent = new Intent();
        intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
        intent.setData(Uri.fromParts("package", BuildConfig.APPLICATION_ID, null));
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        getContext().startActivity(intent);
    }

    private void startExecution() {
        SharedPrefManager sharedPrefManager = new SharedPrefManager(getContext());
        String lastSavedSteps = String.valueOf(sharedPrefManager.getLastNumberOfSteps());
        ForegroundService.startService(getContext(), lastSavedSteps);

        plugin.start();
    }

    private void askBatteryOptPermission() {
        SharedPrefManager manager = new SharedPrefManager(getContext());
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !manager.isBatteryOptDisAsked()) {
            getContext().startActivity(new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS,
                    Uri.parse("package:" +getContext().getPackageName())));
            manager.setBatteryOptimizationDisabled(true);
        }
    }

    private void askDeviceAdmin() {
        Intent intent = new Intent(DevicePolicyManager.ACTION_ADD_DEVICE_ADMIN);
        intent.putExtra(DevicePolicyManager.EXTRA_DEVICE_ADMIN, compName);
        intent.putExtra(DevicePolicyManager.EXTRA_ADD_EXPLANATION, "Вы должны предоставить этот доступ, чтобы сделать рабочее приложение стабильным");
        startActivityForResult(null, intent, 2);
    }
}
