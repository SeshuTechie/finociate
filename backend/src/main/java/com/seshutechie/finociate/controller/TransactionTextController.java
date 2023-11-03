package com.seshutechie.finociate.controller;

import com.seshutechie.finociate.model.*;
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

    @GetMapping("/store-mappings")
    public StoreMappingList getAllStoreMappings() {
        return transactionTextService.getAllStoreMappings();
    }

    @PostMapping("/store-mapping")
    public StoreMapping createStoreMapping(@RequestBody StoreMapping storeMapping) {
        return transactionTextService.saveStoreMapping(storeMapping);
    }
    @DeleteMapping("/store-mapping/{id}")
    public StoreMapping deleteStoreMapping(@PathVariable String id) {
        return transactionTextService.deleteStoreMapping(id);
    }

    @GetMapping("/store-params")
    public StoreParamsList getAllStoreParams() {
        return transactionTextService.getAllStoreParams();
    }

    @PostMapping("/store-params")
    public StoreParams createStoreMapping(@RequestBody StoreParams storeParams) {
        return transactionTextService.saveStoreParams(storeParams);
    }
    @DeleteMapping("/store-params/{id}")
    public StoreParams deleteStoreParams(@PathVariable String id) {
        return transactionTextService.deleteStoreParams(id);
    }
}
