package com.seshutechie.finociate.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "RefData")
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RefData {
    @Id
    private String id;
    private String key;
    private String value;
    private String description;
}
