package com.seshutechie.finociate.common;

import com.seshutechie.finociate.common.util.DateUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.time.ZoneId;
import java.util.TimeZone;

@Configuration
public class AppConfig {
    @Value("${app.date-format}")
    public String dateFormat;

    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jacksonObjectMapperCustomization() {
        return jacksonObjectMapperBuilder ->
                jacksonObjectMapperBuilder.timeZone(ZoneId.systemDefault().toString());
    }
}
