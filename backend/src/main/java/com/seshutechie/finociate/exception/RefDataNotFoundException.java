package com.seshutechie.finociate.exception;

public class RefDataNotFoundException  extends RuntimeException {
    public RefDataNotFoundException(String id) {
        super("Could not find RefData " + id);
    }
}
