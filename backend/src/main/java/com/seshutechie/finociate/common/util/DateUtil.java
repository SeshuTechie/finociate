package com.seshutechie.finociate.common.util;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Date;
import java.util.TimeZone;

public class DateUtil {
    public static final String ZONE_UTC = "UTC";
    public static final ZoneId ZONE_ID_UTC = ZoneId.of(ZONE_UTC);
    public static final ZoneId ZONE_ID_SYSTEM = ZoneId.systemDefault();

    public static final Date getStartOfMonth(Date date) {
        Date startOfMonth = null;
        if (date != null) {
            LocalDate localDate = getLocalDate(date);
            startOfMonth = getDate(getStartOfMonth(localDate));
        }
        return startOfMonth;
    }

    public static final Date getEndOfMonth(Date date) {
        Date endOfMonth = null;
        if (date != null) {
            LocalDate localDate = getLocalDate(date);
            endOfMonth = getDate(getEndOfMonth(localDate));
        }
        return endOfMonth;
    }

    public static final Date[] getStartAndEndOfMonth(Date date) {
        Date[] dates = null;
        if (date != null) {
            dates = new Date[2];
            LocalDate localDate = getLocalDate(date);
            dates[0] = getDate(getStartOfMonth(localDate));
            dates[1] = getDate(getEndOfMonth(localDate));
        }
        return dates;
    }

    public static LocalDate getStartOfMonth(LocalDate localDate) {
        return localDate != null ? localDate.withDayOfMonth(1) : null;
    }

    public static LocalDate getEndOfMonth(LocalDate localDate) {
        return localDate != null ? localDate.plusMonths(1).withDayOfMonth(1).minusDays(1) : null;
    }

    public static LocalDate getLocalDate(Date date) {
        return date != null ? date.toInstant()
                .atZone(ZONE_ID_SYSTEM)
                .toLocalDate() : null;
    }

    public static Date getDate(LocalDate localDate) {
        return localDate != null ? Date.from(localDate.atStartOfDay()
                .atZone(ZONE_ID_SYSTEM)
                .toInstant()) : null;
    }

    public static SimpleDateFormat getDateFormat(String format) {
        SimpleDateFormat dateFormat = new SimpleDateFormat(format);
        dateFormat.setTimeZone(TimeZone.getTimeZone(ZONE_UTC));
        return dateFormat;
    }

    public static Date getDateFrom(Date date, int diffDays) {
        return getDate(getLocalDate(date).plusDays(diffDays));
    }

    /*
    *  For Dirty Testing
    * */
    public static void main(String[] args) {
        Date date = new Date();
        System.out.println(date);
        System.out.println(getLocalDate(date));
        System.out.println(getDateFrom(date, -1));
        System.out.println(getDateFrom(date, 1));
    }
}
