package com.seshutechie.finociate.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReportItemEntry {
    private List<String> fieldValues;
    private double amount;
    private double credit;
    private double debit;
    private double savings;
}
