package com.seshutechie.finociate.model;

import lombok.Data;

import java.util.List;

@Data
public class RefDataList {
    private List<RefData> list;

    public RefDataList(List<RefData> list) {
        this.list = list;
    }
}
