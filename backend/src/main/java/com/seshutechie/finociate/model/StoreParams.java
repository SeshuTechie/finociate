package com.seshutechie.finociate.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = Collections.StoreParams)
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class StoreParams {
    @Id
    private String id;
    private String store;
    private String description;
    private String category;
    private String subcategory;
}
