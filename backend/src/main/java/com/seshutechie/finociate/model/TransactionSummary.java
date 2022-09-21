package com.seshutechie.finociate.model;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class TransactionSummary {
    Double totalSpend;
    Double totalIncome;
    Double totalSavings;
    Double savingsPercent;

}
