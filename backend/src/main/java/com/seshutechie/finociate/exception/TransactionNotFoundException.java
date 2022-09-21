package com.seshutechie.finociate.exception;

public class TransactionNotFoundException extends RuntimeException {
    public TransactionNotFoundException(String id) {
        super("Could not find transaction " + id);
    }
}
