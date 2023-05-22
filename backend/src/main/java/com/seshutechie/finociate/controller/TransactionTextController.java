package com.seshutechie.finociate.controller;

import com.seshutechie.finociate.model.Transaction;
import com.seshutechie.finociate.model.TransactionText;
import com.seshutechie.finociate.model.TransactionTextPattern;
import com.seshutechie.finociate.service.TransactionTextService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("http://localhost:4200")
@RestController
public class TransactionTextController {
    @Autowired
    TransactionTextService transactionTextService;

    @PostMapping("/transaction-text")
    public Transaction parseTransaction(@RequestBody TransactionText transactionText) {
        return transactionTextService.parseTransaction(transactionText.getText());
    }

    @PostMapping("/transaction-text-pattern")
    public TransactionTextPattern createTransactionTextPattern(@RequestBody TransactionTextPattern transactionTextPattern) {
        return transactionTextService.saveTextPattern(transactionTextPattern);
    }

    @GetMapping("/transaction-text-pattern/{id}")
    public TransactionTextPattern getTransactionTextPattern(@PathVariable String id) {
        return transactionTextService.getTextPattern(id);
    }

    @PutMapping("/transaction-text-pattern")
    public TransactionTextPattern updateTransactionTextPattern(@RequestBody TransactionTextPattern transactionTextPattern) {
        return transactionTextService.updateTextPattern(transactionTextPattern);
    }

    @DeleteMapping("/transaction-text-pattern/{id}")
    public TransactionTextPattern deleteTransactionTextPattern(@PathVariable String id) {
        return transactionTextService.deleteTextPattern(id);
    }

    @GetMapping("/transaction-text-patterns")
    public List<TransactionTextPattern> getAllTransactionTextPattern() {
        return transactionTextService.getAllTextPattern();
    }
}
