package com.seshutechie.finociate.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReportItemData {
    private String title;
    private List<String> groupByFields;
    private String aggregationType; // Overall, Monthly
    private String displayType; // Table, Chart
    private String valueType; // Table, Chart
    private Map<String, List<ReportItemEntry>> itemEntries;
}
