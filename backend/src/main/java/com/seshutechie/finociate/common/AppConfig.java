package com.seshutechie.finociate.common;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AppConfig {
    @Value("${app.date-format}")
    public String dateFormat;
}
