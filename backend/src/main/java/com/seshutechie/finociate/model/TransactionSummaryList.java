package com.seshutechie.finociate.model;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class TransactionSummaryList {
    List<TransactionSummary> list;
}
