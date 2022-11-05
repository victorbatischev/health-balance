package com.academia.health.utils;

import android.os.Build;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Locale;

public class DateHelper {
//    private static final Date date = new Date();
    public static final DateFormat dateFormat = new SimpleDateFormat(
            "ddMMyyy", Locale.US);

    public DateHelper() {
    }

    public static Boolean isSameDay(Date currentDate) {
        Date date = new Date();
        return dateFormat.format(currentDate).equals(dateFormat.format(date));
    }
}