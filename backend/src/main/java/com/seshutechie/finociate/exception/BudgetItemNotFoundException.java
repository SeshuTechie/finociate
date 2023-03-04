package com.seshutechie.finociate.exception;

public class BudgetItemNotFoundException  extends RuntimeException {
    public BudgetItemNotFoundException(String id) {
        super("Could not find budget item: " + id);
    }
}
