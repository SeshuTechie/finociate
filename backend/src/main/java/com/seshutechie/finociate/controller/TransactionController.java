package com.seshutechie.finociate.controller;

import com.seshutechie.finociate.model.*;
import com.seshutechie.finociate.service.TransactionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin("http://localhost:4200")
@RestController
public class TransactionController {
    private static final Logger logger = LoggerFactory.getLogger(TransactionController.class);


    @Autowired
    private TransactionService transactionService;

    @Autowired
    private ControllerUtil controllerUtil;


    @GetMapping("/transaction/{id}")
    public Transaction getTransaction(@PathVariable String id) {
        return transactionService.getTransaction(id);
    }

    @GetMapping("/transactions")
    public TransactionList getTransactions(@RequestParam Optional<String> fromDate, @RequestParam Optional<String> toDate) {
        return transactionService.getTransactions(controllerUtil.getFilterOptions(fromDate, toDate));
    }


    @GetMapping("/transactions/summary")
    public TransactionSummary getTransactionsSummary(@RequestParam Optional<String> fromDate, @RequestParam Optional<String> toDate) {
        return transactionService.getTransactionsSummary(controllerUtil.getFilterOptions(fromDate, toDate));
    }

    @GetMapping("/summary/categories")
    public AmountsData getCategoryAmountData(@RequestParam Optional<String> fromDate, @RequestParam Optional<String> toDate) {
        return transactionService.getCategoryAmountsData(controllerUtil.getFilterOptions(fromDate, toDate));
    }

    @GetMapping("/summary/monthly")
    public TransactionSummaryList getMonthlySummary(@RequestParam Optional<String> fromDate, @RequestParam Optional<String> toDate) {
        return transactionService.getMonthlySummary(controllerUtil.getFilterOptions(fromDate, toDate));
    }


    @PostMapping("/transaction")
    public Transaction createTransaction(@RequestBody Transaction transaction) {
        return transactionService.saveTransaction(transaction);
    }

    @PutMapping("/transaction")
    public Transaction updateTransaction(@RequestBody Transaction transaction) {
        return transactionService.updateTransaction(transaction);
    }

    @DeleteMapping("/transaction/{id}")
    public Transaction deleteTransaction(@PathVariable String id) {
        return transactionService.deleteTransaction(id);
    }

    @GetMapping("/distinct-values/{field}")
    public List<String> getTransactionsSummary(@PathVariable String field) {
        return transactionService.getDistinctValues(field);
    }
}
