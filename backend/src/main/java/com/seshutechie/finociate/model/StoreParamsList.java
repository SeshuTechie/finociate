package com.seshutechie.finociate.model;

import lombok.Data;

import java.util.List;

@Data
public class StoreParamsList {
    private List<StoreParams> list;

    public StoreParamsList(List<StoreParams> list) {
        this.list = list;
    }
}
