package com.seshutechie.finociate.controller;

import com.seshutechie.finociate.common.util.CommonUtil;
import com.seshutechie.finociate.model.BudgetItem;
import com.seshutechie.finociate.model.Budget;
import com.seshutechie.finociate.model.BudgetParams;
import com.seshutechie.finociate.service.BudgetService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin("http://localhost:4200")
@RestController
public class BudgetController {
    private static final Logger logger = LoggerFactory.getLogger(BudgetController.class);
    
    @Autowired
    private BudgetService budgetService;

    @Autowired
    private CommonUtil commonUtil;

    @GetMapping("/budget")
    public Budget getBudget(@RequestParam Optional<String> budgetMonth) {
        return budgetService.getBudget(commonUtil.getDate(budgetMonth.orElse(null)));
    }

    @PostMapping("/new-budget")
    public Budget createBudget(@RequestBody BudgetParams budgetParams) {
        return budgetService.createBudget(budgetParams);
    }

    @GetMapping("/budget-item/{id}")
    public BudgetItem getBudgetItem(@PathVariable String id) {
        return budgetService.getBudgetItem(id);
    }

    @PostMapping("/budget-item")
    public BudgetItem createBudgetItem(@RequestBody BudgetItem budgetItem) {
        return budgetService.saveBudgetItem(budgetItem);
    }

    @PutMapping("/budget-item")
    public BudgetItem updateBudgetItem(@RequestBody BudgetItem budgetItem) {
        return budgetService.updateBudgetItem(budgetItem);
    }

    @DeleteMapping("/budget-item/{id}")
    public BudgetItem deleteBudgetItem(@PathVariable String id) {
        return budgetService.deleteBudgetItem(id);
    }

    @GetMapping("/budget/download")
    public ResponseEntity<Resource> downloadTransactions(@RequestParam Optional<String> fromDate, @RequestParam Optional<String> toDate) {
        String filename = "Budget_" + fromDate.orElse("") + "_" + toDate.orElse("") + ".csv";
        InputStreamResource file = new InputStreamResource(budgetService.downloadBudget(commonUtil.getFilterOptions(fromDate, toDate)));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType("application/csv"))
                .body(file);
    }

}
