package com.seshutechie.finociate.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReportData {
    private String name;
    private List<ReportRowData> rowDataList;
}
