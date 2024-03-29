package com.seshutechie.finociate.controller;

import com.seshutechie.finociate.common.util.CommonUtil;
import com.seshutechie.finociate.model.*;
import com.seshutechie.finociate.service.TransactionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
    private CommonUtil commonUtil;


    @GetMapping("/transaction/{id}")
    public Transaction getTransaction(@PathVariable String id) {
        return transactionService.getTransaction(id);
    }

    @GetMapping("/transactions")
    public TransactionList getTransactions(@RequestParam Optional<String> fromDate, @RequestParam Optional<String> toDate) {
        return transactionService.getTransactions(commonUtil.getFilterOptions(fromDate, toDate));
    }

    @GetMapping("/transactions/download")
    public ResponseEntity<Resource> downloadTransactions(@RequestParam Optional<String> fromDate, @RequestParam Optional<String> toDate) {
        String filename = "Transactions_" + fromDate.orElse("") + "_" + toDate.orElse("") + ".csv";
        InputStreamResource file = new InputStreamResource(transactionService.downloadTransactions(commonUtil.getFilterOptions(fromDate, toDate)));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.parseMediaType("application/csv"))
                .body(file);
    }

    @GetMapping("/transactions/summary")
    public TransactionSummary getTransactionsSummary(@RequestParam Optional<String> fromDate, @RequestParam Optional<String> toDate) {
        return transactionService.getTransactionsSummary(commonUtil.getFilterOptions(fromDate, toDate));
    }

    @GetMapping("/summary/categories")
    public AmountsData getCategoryAmountData(@RequestParam Optional<String> fromDate, @RequestParam Optional<String> toDate) {
        return transactionService.getCategoryAmountsData(commonUtil.getFilterOptions(fromDate, toDate));
    }

    @GetMapping("/summary/monthly")
    public TransactionSummaryList getMonthlySummary(@RequestParam Optional<String> fromDate, @RequestParam Optional<String> toDate) {
        return transactionService.getMonthlySummary(commonUtil.getFilterOptions(fromDate, toDate));
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
    public List<String> getTransactionsSummary(@PathVariable String field, @RequestParam Optional<String> matchValue) {
        return transactionService.getDistinctValues(field, matchValue.orElse(null));
    }
}
