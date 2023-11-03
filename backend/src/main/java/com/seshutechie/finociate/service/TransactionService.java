package com.seshutechie.finociate.service;

import com.mongodb.client.DistinctIterable;
import com.mongodb.client.MongoCursor;
import com.seshutechie.finociate.common.AppConstants;
import com.seshutechie.finociate.common.util.DateUtil;
import com.seshutechie.finociate.exception.InvalidDataException;
import com.seshutechie.finociate.exception.TransactionNotFoundException;
import com.seshutechie.finociate.model.*;
import com.seshutechie.finociate.model.Collections;
import com.seshutechie.finociate.repository.TransactionRepo;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.QuoteMode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.io.*;
import java.time.LocalDate;
import java.util.*;

import static java.util.stream.Collectors.groupingBy;
import static java.util.stream.Collectors.summingDouble;

@Service
public class TransactionService {
    private static final Logger logger = LoggerFactory.getLogger(TransactionService.class);
    private static final List<String> CSV_HEADER = Arrays.asList("date", "type", "description", "amount",
            "account", "category", "subcategory", "store", "mode", "particulars", "notes");

    @Autowired
    private TransactionRepo transactionRepo;

    @Autowired
    private MongoTemplate mongoTemplate;

    public Transaction getTransaction(String id) {
        try {
            return transactionRepo.findById(id).orElseThrow();
        } catch (NoSuchElementException ex) {
            throw new TransactionNotFoundException(id);
        }
    }

    public Transaction saveTransaction(Transaction transaction) {
        validateTransaction(transaction);
        return transactionRepo.save(transaction);
    }

    private void validateTransaction(Transaction transaction) {
        if (transaction == null) {
            logger.error("Transaction is null");
            throw new InvalidDataException("Transaction is null");
        }
        if (transaction.getDate() == null) {
            logger.error("Transaction Date is null");
            throw new InvalidDataException("Transaction Date is null");
        }
        try {
            TransactionTypes.valueOf(transaction.getType());
        } catch (Exception ex) {
            throw new InvalidDataException("Invalid Transaction Type: " + transaction.getType());
        }
        if (transaction.getAmount() <= 0) {
            logger.error("Invalid Amount: {}", transaction.getAmount());
            throw new InvalidDataException("Invalid Amount:" + transaction.getAmount());
        }
        if (transaction.getAccount() == null || transaction.getAccount().trim().equals("")) {
            logger.error("Transaction Account is null");
            throw new InvalidDataException("Transaction Account is required");
        }
        if (transaction.getCategory() == null || transaction.getCategory().trim().equals("")) {
            logger.error("Transaction Category is null");
            throw new InvalidDataException("Transaction Category is required");
        }
    }

    public Transaction updateTransaction(Transaction transaction) {
        try {
            transactionRepo.findById(transaction.getId()).orElseThrow();
            validateTransaction(transaction);
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

    public TransactionList getTransactions(FilterParameters filters) {
        TransactionList transactionList = new TransactionList();
        if (filters != null) {
            if (filters.getFromDate() != null && filters.getToDate() != null) {
                logger.debug("Getting all transactions between dates: {} {}", filters.getFromDate(), filters.getToDate());
                transactionList.setTransactions(
                        transactionRepo.findAllByDateBetween(filters.getFromDate(), filters.getToDate()));
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
                double totalCredit = transactions.stream().filter(t -> AppConstants.TYPE_CREDIT.equalsIgnoreCase(t.getType())).mapToDouble(Transaction::getAmount).sum();
                double totalDebit = transactions.stream().filter(t -> AppConstants.TYPE_DEBIT.equalsIgnoreCase(t.getType())).mapToDouble(Transaction::getAmount).sum();
                double totalSavings = transactions.stream().filter(t -> AppConstants.CATEGORY_SAVINGS.equalsIgnoreCase(t.getCategory())).mapToDouble(Transaction::getAmount).sum();
                transactionSummary.setTotalIncome(totalCredit);
                transactionSummary.setTotalSpend(totalDebit - totalSavings);
                transactionSummary.setTotalSavings(totalSavings);
                transactionSummary.setSavingsPercent(totalCredit > 0 ? totalSavings / totalCredit : 0);
                if (filters != null) {
                    transactionSummary.setDate(DateUtil.getStartOfMonth(filters.getFromDate()));
                }
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

    public TransactionSummaryList getMonthlySummary(FilterParameters filterOptions) {
        if (filterOptions == null || filterOptions.getFromDate() == null || filterOptions.getToDate() == null) {
            throw new IllegalArgumentException("From and To dates are required");
        }
        List<TransactionSummary> list = new ArrayList<>();
        TransactionSummaryList transactionSummaryList = new TransactionSummaryList(list);

        FilterParameters filterParameters = new FilterParameters();
        LocalDate startDate = DateUtil.getLocalDate(filterOptions.getFromDate());
        LocalDate endDate = DateUtil.getLocalDate(filterOptions.getToDate());
        LocalDate currentStartDate = startDate;
        while (currentStartDate.isBefore(endDate)) {
            currentStartDate = DateUtil.getStartOfMonth(currentStartDate);
            filterParameters.setFromDate(DateUtil.getDate(currentStartDate));
            filterParameters.setToDate(DateUtil.getDate(DateUtil.getEndOfMonth(currentStartDate)));
            TransactionSummary transactionsSummary = getTransactionsSummary(filterParameters);
            list.add(transactionsSummary);
            currentStartDate = currentStartDate.plusMonths(1);
        }
        return transactionSummaryList;
    }

    public List<String> getDistinctValues(String field, String value) {
        DistinctIterable<String> iterable = null;
        if (value != null) {
            Criteria criteria = new Criteria();
            criteria.where(field).regex("/.*" + value + ".*/i");
            Query query = new Query();
            query.addCriteria(criteria);
            iterable = mongoTemplate.getCollection(Collections.Transactions)
                    .distinct(field, query.getQueryObject(), String.class);
        } else {
            iterable = mongoTemplate.getCollection(Collections.Transactions)
                    .distinct(field, String.class);
        }
        List<String> list;
        try (MongoCursor<String> cursor = iterable.iterator()) {
            list = new ArrayList<>();
            while (cursor.hasNext()) {
                list.add(cursor.next());
            }
        }
        return list;
    }

    public InputStream downloadTransactions(FilterParameters filterOptions) {
        TransactionList transactionList = getTransactions(filterOptions);
        ByteArrayInputStream inputStream = null;
        if (transactionList != null && transactionList.getTransactions() != null) {
            inputStream = transactionsToStream(transactionList.getTransactions());
        }
        return inputStream;
    }

    private ByteArrayInputStream transactionsToStream(List<Transaction> transactions) {
        final CSVFormat format = CSVFormat.DEFAULT.withQuoteMode(QuoteMode.MINIMAL);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream();
             CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(out), format);) {
            csvPrinter.printRecord(CSV_HEADER);
            for (Transaction transaction : transactions) {
                List<String> data = Arrays.asList(
                        transaction.getDate().toString(),
                        transaction.getType(),
                        transaction.getDescription(),
                        String.valueOf(transaction.getAmount()),
                        transaction.getAccount(),
                        transaction.getCategory(),
                        transaction.getSubCategory(),
                        transaction.getStore(),
                        transaction.getMode(),
                        transaction.getParticulars(),
                        transaction.getNotes()
                );
                csvPrinter.printRecord(data);
            }

            csvPrinter.flush();
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            logger.error("Failed to import data to CSV file: " + e.getMessage());
        }
        return null;
    }
}
