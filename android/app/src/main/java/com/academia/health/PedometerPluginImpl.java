package com.academia.health;

import java.util.Date;
import java.util.List;

import android.Manifest;
import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.util.Log;

import com.academia.health.utils.DateHelper;
import com.academia.health.utils.SharedPrefManager;
import com.getcapacitor.JSObject;
import com.getcapacitor.NativePlugin;

/**
 * This class listens to the pedometer sensor
 */

@NativePlugin(
        name = "PedometerPlugin",
        permissions = { Manifest.permission.ACTIVITY_RECOGNITION }
)
public class PedometerPluginImpl implements SensorEventListener {

    public static int STOPPED = 0;
    public static int STARTING = 1;
    public static int RUNNING = 2;
    public static int ERROR_FAILED_TO_START = 3;
    public static int ERROR_NO_SENSOR_FOUND = 4;

    private int status;     // status of listener
    private int startSteps; // first value, to be subtracted
    private static long startTimestamp; // time stamp of when the measurement starts

    private SensorManager sensorManager; // Sensor manager

    public PedometerPluginListener listener;
    public PedometerPluginListener listenerForService;
    private static PedometerPluginImpl instance;

    SharedPrefManager sharedPrefManager;

    public int lastNumberOfSteps = 0;

    private PedometerPluginImpl() {
        startTimestamp = 0;
        this.startSteps = 0;
        this.setStatus(PedometerPluginImpl.STOPPED);
    }

    public static PedometerPluginImpl getInstance() {
        if (instance == null) {
            instance = new PedometerPluginImpl();
        }

        return instance;
    }

    public void initialize(Context context) {
        if (this.sensorManager == null) {
            this.sensorManager = (SensorManager) context.getSystemService(Context.SENSOR_SERVICE);
            this.sharedPrefManager = new SharedPrefManager(context);
            this.startSteps = 0;
            this.lastNumberOfSteps = sharedPrefManager.getLastNumberOfSteps();
        }
    }

    /**
     * Start listening for pedometers sensor.
     */
    public void start() {
        // If already starting or running, then return
        if ((this.status == PedometerPluginImpl.RUNNING) ||
                (this.status == PedometerPluginImpl.STARTING)) {
            return;
        }

        startTimestamp = System.currentTimeMillis();
        this.startSteps = 0;
        this.setStatus(PedometerPluginImpl.STARTING);

        // Get pedometer from sensor manager
        List<Sensor> list = this.sensorManager.getSensorList(Sensor.TYPE_STEP_COUNTER);

        // If found, then register as listener
        if ((list != null) && (list.size() > 0)) {
            // Pedometer sensor returned by sensor manager
            Sensor mSensor = list.get(0);
            if (this.sensorManager.registerListener(this, mSensor,
                    SensorManager.SENSOR_DELAY_FASTEST)) {
                this.setStatus(PedometerPluginImpl.STARTING);
            } else {
                this.setStatus(PedometerPluginImpl.ERROR_FAILED_TO_START);
                this.fail(PedometerPluginImpl.ERROR_FAILED_TO_START,
                        "Device sensor returned an error.");
            }
        } else {
            this.setStatus(PedometerPluginImpl.ERROR_NO_SENSOR_FOUND);
            this.fail(PedometerPluginImpl.ERROR_NO_SENSOR_FOUND,
                    "No sensors found to register step counter listening to.");
        }
    }

    /**
     * Stop listening to sensor.
     */
    public void stop() {
        if (this.status != PedometerPluginImpl.STOPPED) {
            this.sensorManager.unregisterListener(this);
        }
        this.setStatus(PedometerPluginImpl.STOPPED);
    }

    /**
     * Called when the accuracy of the sensor has changed.
     */
    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
        //nothing to do here
    }

    /**
     * Sensor listener event.
     * @param event emitted when sensor data has changed
     */
    @Override
    public void onSensorChanged(SensorEvent event) {
        // Only look at step counter events
        if (event.sensor.getType() != Sensor.TYPE_STEP_COUNTER) {
            return;
        }

        // If not running, then just return
        if (this.status == PedometerPluginImpl.STOPPED) {
            return;
        }
        this.setStatus(PedometerPluginImpl.RUNNING);

        int steps = (int) event.values[0];
        Log.e("testtest", "steps before calc: "+steps);

        if(this.startSteps == 0)
            this.startSteps = steps;

        steps = (steps - this.startSteps) + lastNumberOfSteps;

        Log.e("testtest", "steps: "+steps);
        Log.e("testtest", "startSteps: "+startSteps);
        Log.e("testtest", "lastNumberOfSteps: "+lastNumberOfSteps);

        this.win(getStepsJSON(steps));
    }

    public void reset() {
        this.startSteps = 0;
        this.lastNumberOfSteps = 0;
        this.sharedPrefManager.clearAll();
        if (this.listener != null) {
            this.listener.onReceived(getStepsJSON(0));
        }

        if (this.listenerForService != null) {
            this.listenerForService.onReceived(getStepsJSON(0));
        }
    }

    // Sends an error back to JS
    private void fail(int code, String message) {
        // Error object
//        callbackContext.reject(message, "" + code);
    }

    private void win(JSObject message) {
        // Success return object
        if (this.listener != null) {
            this.listener.onReceived(message);
        }

        if (this.listenerForService != null) {
            this.listenerForService.onReceived(message);
        }
    }

    private void win(boolean success) {
        // Success return object
//        callbackContext.resolve();
    }

    private void setStatus(int status) {
        this.status = status;
    }

    public static JSObject getStepsJSON(int steps) {
        Date currentDate = new Date();
        JSObject r = new JSObject();
        r.put("startDate", startTimestamp);
        r.put("endDate", System.currentTimeMillis());
        r.put("currentDate", DateHelper.dateFormat.format(currentDate));
        r.put("numberOfSteps", steps);
        return r;
    }
}
