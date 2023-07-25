package com.seshutechie.finociate.common.util;

import com.seshutechie.finociate.common.AppConfig;
import com.seshutechie.finociate.model.FilterParameters;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;

@Component
public class CommonUtil {

    private static final Logger logger = LoggerFactory.getLogger(CommonUtil.class);

    @Autowired
    private AppConfig appConfig;
    private SimpleDateFormat dateFormat;

    @PostConstruct
    private void init() {
        dateFormat = DateUtil.getDateFormat(appConfig.dateFormat);
    }
    public FilterParameters getFilterOptions(Optional<String> fromDate, Optional<String> toDate) {
        FilterParameters filter = new FilterParameters();
        filter.setFromDate(getDate(fromDate.orElse(null)));
        filter.setToDate(getDate(toDate.orElse(null)));
        return filter;
    }

    public Date getDate(String date) {
        if (date != null && !date.trim().isEmpty()) {
            try {
                return dateFormat.parse(date);
            } catch (ParseException e) {
                logger.warn("Could not parse date parameter: " + date);
            }
        }
        return null;
    }

    public String getDateString(Date date) {
        return dateFormat.format(date);
    }
}
