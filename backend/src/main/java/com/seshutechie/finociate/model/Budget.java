package com.seshutechie.finociate.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
public class Budget {
    private Date date;
    private List<BudgetItem> budgetItems;

    private List<BudgetSummaryItem> summaryItems;
}
