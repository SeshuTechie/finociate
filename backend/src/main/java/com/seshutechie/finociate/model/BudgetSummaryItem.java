package com.seshutechie.finociate.model;

import lombok.Data;

@Data
public class BudgetSummaryItem {
    private String account;
    private double brought;
    private double inflow;
    private double outflow;
    private double transferOut;
    private double transferIn;
    private double balance;
}
