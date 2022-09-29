package com.seshutechie.finociate.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class TransactionSummary {
    private Double totalSpend;
    private Double totalIncome;
    private Double totalSavings;
    private Double savingsPercent;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private Date date;
}
