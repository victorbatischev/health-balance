package com.academia.health;

import android.os.Bundle;
import android.util.Log;

import com.academia.health.utils.AutoStartHelper;
import com.academia.health.utils.DateHelper;
import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Plugin;

import java.text.DateFormat;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Initializes the Bridge
    this.init(savedInstanceState, new ArrayList<Class<? extends Plugin>>() {{
      // Additional plugins you've installed go here
      add(PedometerPlugin.class);
    }});

//    AutoStartHelper.getInstance().getAutoStartPermission(this);
  }
}
