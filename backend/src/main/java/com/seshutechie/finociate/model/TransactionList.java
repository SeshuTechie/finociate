package com.seshutechie.finociate.model;

import lombok.Data;

import java.util.List;

@Data
public class TransactionList {
    private List<Transaction> transactions;
}
