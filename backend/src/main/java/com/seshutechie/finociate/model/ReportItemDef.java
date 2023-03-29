package com.seshutechie.finociate.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReportItemDef {
    private String title;
    private List<TransactionCriteria> criteriaList;
    private List<String> groupByFields;
    private String aggregationType; // Overall, Monthly
    private String valueType; // Simple, DebitCredit
    private String displayType; // Table, Chart
}
