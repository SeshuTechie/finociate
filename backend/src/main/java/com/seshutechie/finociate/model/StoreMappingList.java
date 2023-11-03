package com.seshutechie.finociate.model;

import lombok.Data;

import java.util.List;

@Data
public class StoreMappingList {
    private List<StoreMapping> list;

    public StoreMappingList(List<StoreMapping> list) {
        this.list = list;
    }
}
