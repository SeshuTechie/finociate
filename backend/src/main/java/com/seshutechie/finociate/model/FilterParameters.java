package com.seshutechie.finociate.model;

import lombok.Data;
import lombok.ToString;

import java.util.Date;

@Data
@ToString
public class FilterParameters {
    Date fromDate;
    Date toDate;
}
