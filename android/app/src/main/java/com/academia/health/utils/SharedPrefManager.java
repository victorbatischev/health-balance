package com.academia.health.utils;

import android.content.Context;
import android.content.SharedPreferences;

public class SharedPrefManager {
    private static final String STE_KEY = "last_step_data_key";
    private static final String STE_COUNT_KEY = "last_step_count_data_key";

    private final Context context;

    public SharedPrefManager(Context context) {
        this.context = context;
    }

    public void clearAll() {
        SharedPreferences settings = context.getSharedPreferences("prefs", 0);
        settings.edit().clear().apply();
    }

    public void saveSteps(int count) {
        SharedPreferences settings = context.getSharedPreferences("prefs", 0);
        SharedPreferences.Editor editor = settings.edit();
        editor.putInt(STE_COUNT_KEY, count);
        editor.apply();
    }

    public int getLastNumberOfSteps() {
        SharedPreferences settings = context.getSharedPreferences("prefs", 0);
        return settings.getInt(STE_COUNT_KEY, 0);
    }

    public void save(String data) {
        SharedPreferences settings = context.getSharedPreferences("prefs", 0);
        SharedPreferences.Editor editor = settings.edit();
        editor.putString(STE_KEY, data);
        editor.apply();
    }

    public String getData() {
        SharedPreferences settings = context.getSharedPreferences("prefs", 0);
        return settings.getString(STE_KEY, null);
    }
}
