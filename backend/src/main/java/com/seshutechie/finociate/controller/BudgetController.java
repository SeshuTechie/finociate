package com.seshutechie.finociate.controller;

import com.seshutechie.finociate.model.BudgetItem;
import com.seshutechie.finociate.model.Budget;
import com.seshutechie.finociate.model.BudgetParams;
import com.seshutechie.finociate.service.BudgetService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin("http://localhost:4200")
@RestController
public class BudgetController {
    private static final Logger logger = LoggerFactory.getLogger(BudgetController.class);
    
    @Autowired
    private BudgetService budgetService;

    @Autowired
    private ControllerUtil controllerUtil;

    @GetMapping("/budget")
    public Budget getBudget(@RequestParam Optional<String> budgetMonth) {
        return budgetService.getBudget(controllerUtil.getDate(budgetMonth.orElse(null)));
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
}
