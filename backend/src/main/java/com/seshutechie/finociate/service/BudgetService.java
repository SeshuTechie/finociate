package com.seshutechie.finociate.service;

import com.seshutechie.finociate.common.util.CommonUtil;
import com.seshutechie.finociate.exception.BudgetItemNotFoundException;
import com.seshutechie.finociate.exception.InvalidDataException;
import com.seshutechie.finociate.model.*;
import com.seshutechie.finociate.repository.BudgetItemRepo;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.QuoteMode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.*;

@Service
public class BudgetService {
    private static final Logger logger = LoggerFactory.getLogger(BudgetService.class);
    private static final List<String> CSV_HEADER = Arrays.asList("date", "account", "type", "amount", "description",
            "particulars", "category");

    @Autowired
    private CommonUtil commonUtil;
    @Autowired
    private BudgetItemRepo budgetItemRepo;

    public BudgetItem getBudgetItem(String id) {
        try {
            return budgetItemRepo.findById(id).orElseThrow();
        } catch (NoSuchElementException ex) {
            throw new BudgetItemNotFoundException(id);
        }
    }

    public BudgetItem saveBudgetItem(BudgetItem budgetItem) {
        validateBudgetItem(budgetItem);
        return budgetItemRepo.save(budgetItem);
    }

    private void validateBudgetItem(BudgetItem budgetItem) {
        if (budgetItem.getDate() == null) {
            logger.error("Date is missing on Budget Item");
            throw new InvalidDataException("Date is missing on Budget Item");
        }
        if (budgetItem.getType() == null || budgetItem.getType().trim().isEmpty()) {
            logger.error("Type is missing on Budget Item");
            throw new InvalidDataException("Type is missing on Budget Item");
        }
        if (BudgetTypes.TRANSFER.equals(budgetItem.getType())) {
            if (budgetItem.getParticulars() == null || budgetItem.getParticulars().isEmpty()) {
                logger.error("Transfer particulars (To account) missing");
                throw new InvalidDataException("Transfer particulars (To account) missing");
            }
        }
        if (BudgetTypes.BROUGHT.equals(budgetItem.getType())) {
            List<BudgetItem> items = budgetItemRepo.findByDateAndAccountAndType(budgetItem.getDate(),
                    budgetItem.getAccount(), budgetItem.getType());
            if (items != null && items.size() > 0) {
                logger.error("Brought already exists for " + budgetItem.getAccount());
                throw new InvalidDataException("Brought already exists for " + budgetItem.getAccount());
            }
        }
    }

    public BudgetItem updateBudgetItem(BudgetItem budgetItem) {
        try {
            budgetItemRepo.findById(budgetItem.getId()).orElseThrow();
        } catch (NoSuchElementException ex) {
            throw new BudgetItemNotFoundException(budgetItem.getId());
        }
        return budgetItemRepo.save(budgetItem);
    }

    public BudgetItem deleteBudgetItem(String id) {
        BudgetItem budgetItem;
        try {
            budgetItem = budgetItemRepo.findById(id).orElseThrow();
        } catch (NoSuchElementException ex) {
            logger.error("No Budget item found to delete: " + id);
            throw new BudgetItemNotFoundException(id);
        }
        budgetItemRepo.deleteById(id);
        return budgetItem;
    }

    public Budget getBudget(Date fromDate) {
        List<BudgetItem> budgetItems = budgetItemRepo.findAllByDate(fromDate);
        Budget budget = null;
        if (budgetItems != null && budgetItems.size() > 0) {
            budget = new Budget();
            budget.setBudgetItems(budgetItems);
            List<BudgetSummaryItem> summaryItems = new ArrayList<>();
            Map<String, BudgetSummaryItem> summaryItemMap = new HashMap<>();
            for (BudgetItem budgetItem: budgetItems) {
                BudgetSummaryItem summaryItem = getSummaryItem(summaryItemMap, budgetItem.getAccount());
                switch (budgetItem.getType()) {
                    case BudgetTypes.CREDIT -> summaryItem.setInflow(summaryItem.getInflow() + budgetItem.getAmount());
                    case BudgetTypes.DEBIT -> summaryItem.setOutflow(summaryItem.getOutflow() + budgetItem.getAmount());
                    case BudgetTypes.BROUGHT -> summaryItem.setBrought(budgetItem.getAmount());
                    case BudgetTypes.TRANSFER -> {
                        summaryItem.setTransferOut(summaryItem.getTransferOut() + budgetItem.getAmount());
                        BudgetSummaryItem refAccountSummary = getSummaryItem(summaryItemMap, budgetItem.getParticulars());
                        refAccountSummary.setTransferIn(refAccountSummary.getTransferIn() + budgetItem.getAmount());
                    }
                }
            }
            summaryItemMap.values().forEach(summaryItem -> {
                summaryItems.add(summaryItem);
                summaryItem.setBalance(summaryItem.getBrought() + summaryItem.getInflow() + summaryItem.getTransferIn()
                        - summaryItem.getTransferOut() - summaryItem.getOutflow());
            });
            budget.setSummaryItems(summaryItems);
            budget.setDate(fromDate);
        }
        return budget;
    }

    private BudgetSummaryItem getSummaryItem(Map<String, BudgetSummaryItem> summaryItemMap, String account) {
        BudgetSummaryItem summaryItem = summaryItemMap.get(account);
        if (summaryItem == null) {
            summaryItem = new BudgetSummaryItem();
            summaryItem.setAccount(account);
            summaryItemMap.put(account, summaryItem);
        }
        return summaryItem;
    }

    public Budget createBudget(BudgetParams budgetParams) {
        Budget sourceBudget = getBudget(budgetParams.getFromMonth());
        if (sourceBudget == null || sourceBudget.getBudgetItems() == null || sourceBudget.getBudgetItems().size() == 0) {
            throw new InvalidDataException("No budget found for " + budgetParams.getFromMonth());
        }

        sourceBudget.getBudgetItems().forEach(sourceItem -> {
            BudgetItem budgetItem = new BudgetItem(null, sourceItem.getDescription(), budgetParams.getBudgetMonth(),
                    sourceItem.getAmount(), sourceItem.getType(), sourceItem.getAccount(), sourceItem.getCategory(),
                    sourceItem.getParticulars());
            saveBudgetItem(budgetItem);
        });
        return getBudget(budgetParams.getBudgetMonth());
    }

    public InputStream downloadBudget(FilterParameters filterOptions) {
        List<BudgetItem> budgetItems = budgetItemRepo.findAllByDateBetween(filterOptions.getFromDate(), filterOptions.getToDate());
        ByteArrayInputStream inputStream = null;
        if (budgetItems != null && budgetItems.size() > 0) {
            inputStream = budgetItemsToStream(budgetItems);
        }
        return inputStream;
    }

    private ByteArrayInputStream budgetItemsToStream(List<BudgetItem> budgetItems) {
        final CSVFormat format = CSVFormat.DEFAULT.withQuoteMode(QuoteMode.MINIMAL);

        try (ByteArrayOutputStream out = new ByteArrayOutputStream();
             CSVPrinter csvPrinter = new CSVPrinter(new PrintWriter(out), format);) {
            csvPrinter.printRecord(CSV_HEADER);
            for (BudgetItem budgetItem : budgetItems) {
                List<String> data = Arrays.asList(
                        commonUtil.getDateString(budgetItem.getDate()),
                        budgetItem.getAccount(),
                        budgetItem.getType(),
                        String.valueOf(budgetItem.getAmount()),
                        budgetItem.getDescription(),
                        budgetItem.getParticulars(),
                        budgetItem.getCategory()
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
