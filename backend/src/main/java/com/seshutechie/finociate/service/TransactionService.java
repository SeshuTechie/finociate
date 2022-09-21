package com.seshutechie.finociate.service;

import com.seshutechie.finociate.common.AppConstants;
import com.seshutechie.finociate.exception.TransactionNotFoundException;
import com.seshutechie.finociate.model.*;
import com.seshutechie.finociate.repository.TransactionRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.summingDouble;

@Service
public class TransactionService {
    private static final Logger logger = LoggerFactory.getLogger(TransactionService.class);

    @Autowired
    private TransactionRepo transactionRepo;

    @Autowired
    TransactionParser transactionParser;

    public Transaction getTransaction(String id) {
        try {
            return transactionRepo.findById(id).orElseThrow();
        } catch (NoSuchElementException ex) {
            throw new TransactionNotFoundException(id);
        }
    }

    public Transaction saveTransaction(Transaction transaction) {
        return transactionRepo.save(transaction);
    }

    public Transaction updateTransaction(Transaction transaction) {
        try {
            transactionRepo.findById(transaction.getId()).orElseThrow();
        } catch (NoSuchElementException ex) {
            throw new TransactionNotFoundException(transaction.getId());
        }
        return transactionRepo.save(transaction);
    }

    public Transaction deleteTransaction(String id) {
        Transaction transaction = null;
        try {
            transaction = transactionRepo.findById(id).orElseThrow();
        } catch (NoSuchElementException ex) {
            throw new TransactionNotFoundException(id);
        }
        transactionRepo.deleteById(id);
        return transaction;
    }

    public Transaction parseTransaction(TransactionText transactionText) {
        return transactionParser.parseTransaction(transactionText.getText());
    }

    public TransactionList getTransactions(FilterParameters filters) {
        TransactionList transactionList = new TransactionList();
        if (filters != null) {
            if (filters.getFromDate() != null && filters.getToDate() != null) {
                logger.debug("Getting all transactions between dates: {} {}", filters.getFromDate(), filters.getToDate());
                transactionList.setTransactions(
                        transactionRepo.findAllByDateBetween(
                                filters.getFromDate(), filters.getToDate()));
            } else {
                logger.debug("No filter matches, getting all transactions");
                transactionList.setTransactions(transactionRepo.findAll());
            }
        } else {
            logger.debug("No filters, getting all transactions");
            transactionList.setTransactions(transactionRepo.findAll());
        }
        return transactionList;
    }

    public TransactionSummary getTransactionsSummary(FilterParameters filters) {
        TransactionList transactionList = getTransactions(filters);
        TransactionSummary transactionSummary = new TransactionSummary();
        if(transactionList != null) {
            List<Transaction> transactions = transactionList.getTransactions();
            if (transactions != null) {
                double totalCredit = transactions.stream().filter(t -> AppConstants.TYPE_CREDIT.equalsIgnoreCase(t.getType())).mapToDouble(t -> t.getAmount()).sum();
                double totalDebit = transactions.stream().filter(t -> AppConstants.TYPE_DEBIT.equalsIgnoreCase(t.getType())).mapToDouble(t -> t.getAmount()).sum();
                double totalSavings = transactions.stream().filter(t -> AppConstants.CATEGORY_SAVINGS.equalsIgnoreCase(t.getCategory())).mapToDouble(t -> t.getAmount()).sum();
                transactionSummary.setTotalIncome(totalCredit);
                transactionSummary.setTotalSpend(totalDebit - totalSavings);
                transactionSummary.setTotalSavings(totalSavings);
                transactionSummary.setSavingsPercent(totalSavings / totalCredit);
            }
        }
        return transactionSummary;
    }

    public AmountsData getCategoryAmountsData(FilterParameters filters) {
        TransactionList transactionList = getTransactions(filters);
        AmountsData amountsData = new AmountsData();
        if(transactionList != null) {
            List<Transaction> transactions = transactionList.getTransactions();
            if (transactions != null) {
                Map<String, Double> categoryAmounts = transactions.stream()
                        .filter(t -> AppConstants.TYPE_DEBIT.equalsIgnoreCase(t.getType()))
                        .collect(groupingBy(Transaction::getCategory, summingDouble(Transaction::getAmount)));
                amountsData.setData(categoryAmounts);
            }
        }
        return amountsData;
    }
}
