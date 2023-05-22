package com.seshutechie.finociate.model;

public enum TransactionTextParams {
    _AMOUNT_("([[,]?\\\\d+]+\\\\.\\\\d+)"),
    _DATE_("(.*)"),
    _STORE_("(.*)"),
    _SOMETHING_("(.*)");

    TransactionTextParams(String value) {
        this.value = value;
    }

    public final String value;
}
