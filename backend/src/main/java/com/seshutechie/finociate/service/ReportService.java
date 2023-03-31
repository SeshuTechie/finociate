package com.seshutechie.finociate.service;

import com.seshutechie.finociate.exception.InvalidDataException;
import com.seshutechie.finociate.model.*;
import com.seshutechie.finociate.repository.ReportDefRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
public class ReportService {
    private static final Logger logger = LoggerFactory.getLogger(ReportService.class);
    private static final String DELIM = "~_~";
    private static final String HYPHEN = "-";

    @Autowired
    private ReportDefRepo reportDefRepo;

    @Autowired
    private MongoTemplate mongoTemplate;

    public ReportDef getReportDef(String id) {
        return reportDefRepo.findById(id).orElseThrow();
    }

    public ReportDef saveReportDef(ReportDef reportDef) {
        validateReportDef(reportDef);
        return reportDefRepo.save(reportDef);
    }

    private void validateReportDef(ReportDef reportDef) {
        if (reportDef == null) {
            logger.error("Report definition is null");
            throw new InvalidDataException("Report definition is null");
        }
        if (reportDef.getRowDefList() == null || reportDef.getRowDefList().size() == 0) {
            logger.error("No row definition found on Report");
            throw new InvalidDataException("No row definition found on Report");
        }
        reportDef.getRowDefList().forEach(rowDef -> {
            if (rowDef.getItemDefList() == null || rowDef.getItemDefList().size() == 0) {
                logger.error("No items defined on Report's row");
                throw new InvalidDataException("No items defined on Report's row");
            }
            rowDef.getItemDefList().forEach(itemDef -> {
                try {
                    AggregationTypes.valueOf(itemDef.getAggregationType());
                } catch (Exception ex) {
                    throw new InvalidDataException("Invalid Aggregation Type: " + itemDef.getAggregationType());
                }

                try {
                    if (itemDef.getValueType() != null) {
                        ReportValueTypes.valueOf(itemDef.getValueType());
                    }
                } catch (Exception ex) {
                    throw new InvalidDataException("Invalid Value Type: " + itemDef.getValueType());
                }

                if (itemDef.getCriteriaList() != null) {
                    itemDef.getCriteriaList().forEach(criteria -> {
                        try {
                            CriteriaTypes.valueOf(criteria.getCondition());
                        } catch (Exception ex) {
                            throw new InvalidDataException("Invalid Criteria Type: " + criteria.getCondition());
                        }

                        try {
                            TransactionFields.valueOf(criteria.getField());
                        } catch (Exception ex) {
                            throw new InvalidDataException("Invalid Criteria Field: " + criteria.getField());
                        }
                    });

                    if (itemDef.getGroupByFields() != null) {
                        itemDef.getGroupByFields().forEach(field -> {
                            try {
                                TransactionFields.valueOf(field);
                            } catch (Exception ex) {
                                throw new InvalidDataException("Invalid GroupBy Field: " + field);
                            }
                        });
                    }
                }
            });
        });
    }

    public ReportDef updateReportDef(ReportDef reportDef) {
        try {
            reportDefRepo.findById(reportDef.getId()).orElseThrow();
        } catch (Exception ex) {
            throw new InvalidDataException("Report Definition not found: " + reportDef.getId());
        }

        validateReportDef(reportDef);
        return reportDefRepo.save(reportDef);
    }

    public ReportData getReportData(String id, FilterParameters filterOptions) {
        logger.info("Finding report data for {}, Filter: {}", id, filterOptions);
        ReportDef reportDef = getReportDef(id);
        ReportData reportData = new ReportData();
        List<ReportRowDef> rowDefList = reportDef.getRowDefList();
        if (rowDefList != null) {
            List<ReportRowData> rowDataList = new ArrayList<>();
            reportData.setRowDataList(rowDataList);
            reportData.setName(reportDef.getName());
            rowDefList.forEach(rowDef -> {
                ReportRowData reportRowData = new ReportRowData();
                if (rowDef.getItemDefList() != null) {
                    rowDataList.add(reportRowData);
                    List<ReportItemData> itemDataList = new ArrayList<>();
                    reportRowData.setItemDataList(itemDataList);
                    rowDef.getItemDefList().forEach(itemDef -> {
                        ReportItemData reportItem = getReportItem(itemDef, filterOptions);
                        reportItem.setTitle(itemDef.getTitle());
                        itemDataList.add(reportItem);
                    });
                }
            });
        }
        return reportData;
    }

    private ReportItemData getReportItem(ReportItemDef itemDef, FilterParameters filterOptions) {
        ReportItemData reportItemData = new ReportItemData();
        reportItemData.setAggregationType(itemDef.getAggregationType());
        reportItemData.setDisplayType(itemDef.getDisplayType());
        reportItemData.setValueType(itemDef.getValueType());
        reportItemData.setGroupByFields(itemDef.getGroupByFields());
        Query dynamicQuery = new Query();
        if (itemDef.getCriteriaList() != null) {
            itemDef.getCriteriaList().forEach(criteria -> {
                Criteria queryCriteria = getQueryCriteria(criteria);
                dynamicQuery.addCriteria(queryCriteria);
            });
        }

        if (filterOptions.getFromDate() != null) {
            if (filterOptions.getToDate() != null) {
                dynamicQuery.addCriteria(Criteria.where("date").gte(filterOptions.getFromDate()).lte(filterOptions.getToDate()));
            } else {
                dynamicQuery.addCriteria(Criteria.where("date").gte(filterOptions.getFromDate()));
            }
        } else if (filterOptions.getToDate() != null) {
            dynamicQuery.addCriteria(Criteria.where("date").lte(filterOptions.getToDate()));
        }

        List<Transaction> transactions = mongoTemplate.find(dynamicQuery, Transaction.class);
        reportItemData.setItemEntries(getReportEntries(transactions, itemDef));
        return reportItemData;
    }

    private Map<String, List<ReportItemEntry>> getReportEntries(List<Transaction> transactions, ReportItemDef itemDef) {
        Map<String, List<ReportItemEntry>> itemEntries = null;
        if (transactions != null) {
            logger.debug("Found transactions: {}", transactions.size());
            ReportValueTypes valueType = getValueType(itemDef);
            itemEntries = switch (AggregationTypes.valueOf(itemDef.getAggregationType())) {
                case Overall -> {
                    List<ReportItemEntry> list = new ArrayList<>();
                    Map<String, List<Double>> amountMap = new HashMap<>();
                    transactions.forEach(transaction -> updateAmounts(valueType, amountMap, transaction, itemDef));
                    amountMap.forEach((key, amounts) -> {
                        ReportItemEntry reportItemEntry = new ReportItemEntry();
                        list.add(reportItemEntry);
                        setAmounts(valueType, reportItemEntry, amounts);
                        reportItemEntry.setFieldValues(getGroupByFields(key));
                    });
                    Map<String, List<ReportItemEntry>> entries = new HashMap<>();
                    entries.put(AggregationTypes.Overall.name(), list);
                    yield entries;
                }
                case Monthly -> {
                    Map<String, List<ReportItemEntry>> entries = new HashMap<>();
                    Map<String, Map<String, List<Double>>> amountMaps = new HashMap<>();
                    transactions.forEach(transaction -> {
                        String month = getMonth(transaction);
                        Map<String, List<Double>> amountMap = amountMaps.getOrDefault(month, new HashMap<>());
                        amountMaps.put(month, amountMap);
                        updateAmounts(valueType, amountMap, transaction, itemDef);
                    });

                    amountMaps.forEach((month, amountMap) -> {
                        List<ReportItemEntry> list = new ArrayList<>();
                        amountMap.forEach((key, amounts) -> {
                            ReportItemEntry reportItemEntry = new ReportItemEntry();
                            list.add(reportItemEntry);
                            setAmounts(valueType, reportItemEntry, amounts);
                            reportItemEntry.setFieldValues(getGroupByFields(key));
                        });
                        entries.put(month, list);
                    });
                    yield entries;
                }
            };

        } else {
            logger.warn("No transaction been found");
        }

        return itemEntries;
    }

    private void setAmounts(ReportValueTypes valueType, ReportItemEntry reportItemEntry, List<Double> amounts) {
        switch (valueType) {
            case Simple -> reportItemEntry.setAmount(amounts.get(0));
            case CreditDebitSavings -> {
                reportItemEntry.setCredit(amounts.get(0));
                reportItemEntry.setDebit(amounts.get(1));
                reportItemEntry.setSavings(amounts.get(2));
            }
        }
    }

    private void updateAmounts(ReportValueTypes valueType, Map<String, List<Double>> amountMap, Transaction transaction, ReportItemDef itemDef) {
        String groupByKey = getGroupByKey(transaction, itemDef);
        List<Double> amountList = amountMap.getOrDefault(groupByKey, new ArrayList<>(List.of(0.0, 0.0, 0.0)));
        amountMap.put(groupByKey, amountList);
        switch (valueType) {
            case Simple ->
                    amountList.set(0, transaction.getAmount() + amountList.get(0));
            case CreditDebitSavings -> {
                switch (TransactionTypes.valueOf(transaction.getType())) {
                    case credit -> amountList.set(0, transaction.getAmount() + amountList.get(0));
                    case debit -> {
                        if (TransactionCategories.savings.name().equalsIgnoreCase(transaction.getCategory())) {
                            amountList.set(2, transaction.getAmount() + amountList.get(2));
                        } else {
                            amountList.set(1, transaction.getAmount() + amountList.get(1));
                        }
                    }
                }
            }
        }

    }

    private ReportValueTypes getValueType(ReportItemDef itemDef) {
        if (itemDef.getValueType() == null) {
            return ReportValueTypes.Simple;
        }
        return ReportValueTypes.valueOf(itemDef.getValueType());
    }

    private String getMonth(Transaction transaction) {
        LocalDate date = transaction.getDate();
        return date.getMonthValue() + HYPHEN + date.getYear();
    }

    private List<String> getGroupByFields(String key) {
        if (key == null || key.isEmpty()) {
            return null;
        }
        String[] keys = key.split(DELIM, -1);
        return List.of(keys);
    }

    private String getGroupByKey(Transaction transaction, ReportItemDef itemDef) {
        StringBuilder stringBuilder = new StringBuilder();
        if (itemDef.getGroupByFields() != null && itemDef.getGroupByFields().size() > 0) {
            itemDef.getGroupByFields().forEach(field -> {
                stringBuilder.append(switch (TransactionFields.valueOf(field)) {
                    case account -> transaction.getAccount();
                    case category -> transaction.getCategory();
                    case mode -> transaction.getMode();
                    case type -> transaction.getType();
                    case store -> transaction.getStore();
                    case subCategory -> transaction.getSubCategory();
                    default -> "";
                });
                stringBuilder.append(DELIM);
            });

        }
        return stringBuilder.toString();
    }

    private Criteria getQueryCriteria(TransactionCriteria criteria) {
        return switch (CriteriaTypes.valueOf(criteria.getCondition())) {
            case eq -> Criteria.where(criteria.getField()).is(criteria.getValue());
            case ne -> Criteria.where(criteria.getField()).ne(criteria.getValue());
            case gt -> Criteria.where(criteria.getField()).gt(criteria.getValue());
            case lt -> Criteria.where(criteria.getField()).lt(criteria.getValue());
            case gte -> Criteria.where(criteria.getField()).gte(criteria.getValue());
            case lte -> Criteria.where(criteria.getField()).lte(criteria.getValue());
            case in -> Criteria.where(criteria.getField()).in(List.of(criteria.getValue().toString().split(",")));
            case nin -> Criteria.where(criteria.getField()).nin(List.of(criteria.getValue().toString().split(",")));
            case nul -> Criteria.where(criteria.getField()).isNull();
            case nnul -> Criteria.where(criteria.getField()).isNull().not();
            case exists -> Criteria.where(criteria.getField()).exists(true);
        };
    }

    public ReportDef deleteReportDef(String id) {
        ReportDef reportDef;
        try {
            reportDef = reportDefRepo.findById(id).orElseThrow();
        } catch (Exception ex) {
            throw new InvalidDataException("Report Definition not found: " + id);
        }

        reportDefRepo.delete(reportDef);
        return reportDef;
    }

    public List<ReportDef> getAllReportDefs() {
        return reportDefRepo.findAll();
    }
}
