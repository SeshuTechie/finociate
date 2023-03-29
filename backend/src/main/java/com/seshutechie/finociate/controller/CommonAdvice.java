package com.seshutechie.finociate.controller;

import com.seshutechie.finociate.exception.ErrorData;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class CommonAdvice {
    private static final Logger logger = LoggerFactory.getLogger(CommonAdvice.class);

    @ResponseBody
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    ErrorData otherErrorHandler(RuntimeException ex) {
        logger.error("Encountered and error", ex);
        return new ErrorData(ex.getMessage());
    }
}
