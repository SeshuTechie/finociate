package com.seshutechie.finociate.model;

import lombok.Data;

@Data
public class TransactionCriteria {
    private String field;
    private Object value;
    private String condition;
}
