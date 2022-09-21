package com.seshutechie.finociate.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Data
@Document(collection = "Transactions")
@NoArgsConstructor
public class Transaction {
    @Id
    private String id;
    private String description;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
    private Date date;
    private double amount;
    private String type;
    private String category;
    private String subCategory;
    private String store;
    private String particulars;
    private List<String> tags;
    private String notes;
}
