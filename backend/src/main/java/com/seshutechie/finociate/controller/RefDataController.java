package com.seshutechie.finociate.controller;

import com.seshutechie.finociate.model.RefData;
import com.seshutechie.finociate.model.RefDataList;
import com.seshutechie.finociate.service.RefDataService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin("http://localhost:4200")
@RestController
public class RefDataController {
    private static final Logger logger = LoggerFactory.getLogger(RefDataController.class);

    @Autowired
    RefDataService refDataService;

    @GetMapping("/ref-data")
    public RefDataList getRefData(@RequestParam Optional<String> key, @RequestParam Optional<String> valueLike) {
        List<RefData> dataList = refDataService.getRefDataList(key.orElse(null), valueLike.orElse(null));
        return new RefDataList(dataList);
    }

    @PostMapping("/ref-data")
    public RefData createRefData(@RequestBody RefData refData) {
        return refDataService.saveRefData(refData);
    }

    @PutMapping("/ref-data")
    public RefData updateRefData(@RequestBody RefData refData) {
        return refDataService.updateRefData(refData);
    }

    @DeleteMapping("/ref-data/{id}")
    public RefData deleteRefData(@PathVariable String id) {
        return refDataService.deleteRefData(id);
    }

}
