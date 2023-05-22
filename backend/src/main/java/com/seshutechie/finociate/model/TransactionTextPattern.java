package com.seshutechie.finociate.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = Collections.TransactionTextPatterns)
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TransactionTextPattern {
    @Id
    private String id;
    private String name;
    private String identifier;
    private String pattern;
    private String datePattern;
    private Transaction otherValues;
}
