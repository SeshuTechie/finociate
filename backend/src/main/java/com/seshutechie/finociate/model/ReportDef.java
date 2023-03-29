package com.seshutechie.finociate.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Document(collection = "ReportDef")
@Data
public class ReportDef {
    @Id
    private String id;
    private String name;
    private List<ReportRowDef> rowDefList;
}
