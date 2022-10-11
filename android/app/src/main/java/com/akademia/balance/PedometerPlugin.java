package com.akademia.balance;

import java.lang.annotation.Native;
import java.util.List;

import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;

import android.os.Handler;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

/**
 * This class listens to the pedometer sensor
 */

@NativePlugin
public class PedometerPlugin extends Plugin implements SensorEventListener {

    public static int STOPPED = 0;
    public static int STARTING = 1;
    public static int RUNNING = 2;
    public static int ERROR_FAILED_TO_START = 3;
    public static int ERROR_NO_SENSOR_FOUND = 4;

    private int status;     // status of listener
    private float startsteps; //first value, to be substracted
    private long starttimestamp; //time stamp of when the measurement starts

    private final SensorManager sensorManager; // Sensor manager
    private Sensor mSensor;             // Pedometer sensor returned by sensor manager

    private PluginCall callbackContext; // Keeps track of the JS callback context.

    private Handler mainHandler = null;

    /**
     * Constructor
     */
    public PedometerPlugin() {
        this.starttimestamp = 0;
        this.startsteps = 0;
        this.setStatus(PedometerPlugin.STOPPED);
        this.sensorManager = (SensorManager) getActivity().getSystemService(Context.SENSOR_SERVICE);
    }

    /**
     * Executes the request.
     *
     * @param action the action to execute.
     * @param callbackContext the callback context used when calling back into JavaScript.
     * @return whether the action was valid.
     */
    @PluginMethod
    public boolean execute(String action, PluginCall callbackContext) {
        this.callbackContext = callbackContext;

        if (action.equals("isStepCountingAvailable")) {
            List<Sensor> list = this.sensorManager.getSensorList(Sensor.TYPE_STEP_COUNTER);
            if ((list != null) && (list.size() > 0)) {
                this.win(true);
                return true;
            } else {
                this.setStatus(PedometerPlugin.ERROR_NO_SENSOR_FOUND);
                this.win(false);
                return true;
            }
        } else if (action.equals("isDistanceAvailable")) {
            //distance is never available in Android
            this.win(false);
            return true;
        } else if (action.equals("isFloorCountingAvailable")) {
            //floor counting is never available in Android
            this.win(false);
            return true;
        }
        else if (action.equals("startPedometerUpdates")) {
            if (this.status != PedometerPlugin.RUNNING) {
                // If not running, then this is an async call, so don't worry about waiting
                // We drop the callback onto our stack, call start, and let start and the sensor callback fire off the callback down the road
                this.start();
            }


            callbackContext.resolve();
            return true;
        }
        else if (action.equals("stopPedometerUpdates")) {
            if (this.status == PedometerPlugin.RUNNING) {
                this.stop();
            }
            this.win(null);
            return true;
        } else {
            // Unsupported action
            return false;
        }
    }

    /**
     * Called by the Broker when listener is to be shut down.
     * Stop listener.
     */
    public void onDestroy() {
        this.stop();
    }


    /**
     * Start listening for pedometers sensor.
     */
    private void start() {
        // If already starting or running, then return
        if ((this.status == PedometerPlugin.RUNNING) || (this.status == PedometerPlugin.STARTING)) {
            return;
        }

        starttimestamp = System.currentTimeMillis();
        this.startsteps = 0;
        this.setStatus(PedometerPlugin.STARTING);

        // Get pedometer from sensor manager
        List<Sensor> list = this.sensorManager.getSensorList(Sensor.TYPE_STEP_COUNTER);

        if(ContextCompat.checkSelfPermission(getContext(),
                android.Manifest.permission.ACTIVITY_RECOGNITION) == android.content.pm.PackageManager.PERMISSION_DENIED){
            //ask for permission
            ActivityCompat.requestPermissions(getActivity(), new String[]{android.Manifest.permission.ACTIVITY_RECOGNITION}, 1);
        }

        // If found, then register as listener
        if ((list != null) && (list.size() > 0)) {
            this.mSensor = list.get(0);
            if (this.sensorManager.registerListener(this, this.mSensor, SensorManager.SENSOR_DELAY_UI)) {
                this.setStatus(PedometerPlugin.STARTING);
            } else {
                this.setStatus(PedometerPlugin.ERROR_FAILED_TO_START);
                this.fail(PedometerPlugin.ERROR_FAILED_TO_START, "Device sensor returned an error.");
                return;
            };
        } else {
            this.setStatus(PedometerPlugin.ERROR_FAILED_TO_START);
            this.fail(PedometerPlugin.ERROR_FAILED_TO_START, "No sensors found to register step counter listening to.");
            return;
        }
    }

    /**
     * Stop listening to sensor.
     */
    private void stop() {
        if (this.status != PedometerPlugin.STOPPED) {
            this.sensorManager.unregisterListener(this);
        }
        this.setStatus(PedometerPlugin.STOPPED);
    }

    /**
     * Called when the accuracy of the sensor has changed.
     */
    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
        //nothing to do here
        return;
    }

    /**
     * Sensor listener event.
     * @param event
     */
    @Override
    public void onSensorChanged(SensorEvent event) {
        // Only look at step counter events
        if (event.sensor.getType() != Sensor.TYPE_STEP_COUNTER) {
            return;
        }

        // If not running, then just return
        if (this.status == PedometerPlugin.STOPPED) {
            return;
        }
        this.setStatus(PedometerPlugin.RUNNING);

        float steps = event.values[0];

        if(this.startsteps == 0)
            this.startsteps = steps;

        steps = steps - this.startsteps;

        this.win(this.getStepsJSON(steps));
    }

    @PluginMethod
    public void onReset() {
        if (this.status == PedometerPlugin.RUNNING) {
            this.stop();
        }
    }

    // Sends an error back to JS
    private void fail(int code, String message) {
        // Error object
        callbackContext.reject(message, "" + code);
    }

    private void win(JSONObject message) {
        // Success return object
        callbackContext.resolve();
    }

    private void win(boolean success) {
        // Success return object
        callbackContext.resolve();
    }

    private void setStatus(int status) {
        this.status = status;
    }

    private JSONObject getStepsJSON(float steps) {
        JSONObject r = new JSONObject();
        // pedometerData.startDate; -> ms since 1970
        // pedometerData.endDate; -> ms since 1970
        // pedometerData.numberOfSteps;
        // pedometerData.distance;
        // pedometerData.floorsAscended;
        // pedometerData.floorsDescended;
        try {
            r.put("startDate", this.starttimestamp);
            r.put("endDate", System.currentTimeMillis());
            r.put("numberOfSteps", steps);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return r;
    }
}