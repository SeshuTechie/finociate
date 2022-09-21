package com.seshutechie.finociate.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Data
public class AmountsData {
    Map<String, Double> data;

    public AmountsData() {
        data = new HashMap<>();
    }

    public void addData(String key, Double amount) {
        data.put(key, amount);
    }
}
