package com.seshutechie.finociate.controller;

import com.seshutechie.finociate.common.AppConfig;
import com.seshutechie.finociate.common.util.DateUtil;
import com.seshutechie.finociate.model.*;
import com.seshutechie.finociate.service.TransactionService;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;

@CrossOrigin("http://localhost:4200")
@RestController
public class TransactionController {
    private static final Logger logger = LoggerFactory.getLogger(TransactionController.class);

    @Autowired
    private AppConfig appConfig;
    private SimpleDateFormat dateFormat;

    @PostConstruct
    private void init() {
        dateFormat = DateUtil.getDateFormat(appConfig.dateFormat);
    }
    @Autowired
    private TransactionService transactionService;

    @GetMapping("/transaction/{id}")
    public Transaction getTransaction(@PathVariable String id) {
        return transactionService.getTransaction(id);
    }

    @GetMapping("/transactions")
    public TransactionList getTransactions(@RequestParam Optional<String> fromDate, @RequestParam Optional<String> toDate) {
        return transactionService.getTransactions(getFilterOptions(fromDate, toDate));
    }

    private FilterParameters getFilterOptions(Optional<String> fromDate, Optional<String> toDate) {
        FilterParameters filter = new FilterParameters();
        filter.setFromDate(getDate(fromDate.orElse(null)));
        filter.setToDate(getDate(toDate.orElse(null)));
        return filter;
    }

    @GetMapping("/transactions/summary")
    public TransactionSummary getTransactionsSummary(@RequestParam Optional<String> fromDate, @RequestParam Optional<String> toDate) {
        return transactionService.getTransactionsSummary(getFilterOptions(fromDate, toDate));
    }

    @GetMapping("/summary/categories")
    public AmountsData getCategoryAmountData(@RequestParam Optional<String> fromDate, @RequestParam Optional<String> toDate) {
        return transactionService.getCategoryAmountsData(getFilterOptions(fromDate, toDate));
    }

    @GetMapping("/summary/monthly")
    public TransactionSummaryList getMonthlySummary(@RequestParam Optional<String> fromDate, @RequestParam Optional<String> toDate) {
        return transactionService.getMonthlySummary(getFilterOptions(fromDate, toDate));
    }

    private Date getDate(String date) {
        if (date != null && !date.trim().isEmpty()) {
            try {
                return dateFormat.parse(date);
            } catch (ParseException e) {
                logger.warn("Could not parse date parameter: " + date);
            }
        }
        return null;
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

    @PostMapping("/text-transaction")
    public Transaction parseTransaction(@RequestBody TransactionText transactionText) {
        return transactionService.parseTransaction(transactionText);
    }
}
