package com.seshutechie.finociate.service;

import com.seshutechie.finociate.exception.InvalidDataException;
import com.seshutechie.finociate.model.*;
import com.seshutechie.finociate.repository.StoreMappingRepo;
import com.seshutechie.finociate.repository.StoreParamsRepo;
import com.seshutechie.finociate.repository.TransactionTextPatternRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class TransactionTextService {
    private static final Logger logger = LoggerFactory.getLogger(TransactionTextService.class);
    private static final String DATE_DELIMITER = ";";

    @Autowired
    private TransactionTextPatternRepo transactionTextPatternRepo;

    @Autowired
    private StoreMappingRepo storeMappingRepo;

    @Autowired
    private StoreParamsRepo storeParamsRepo;

    public Transaction parseTransaction(String text) {
        Transaction transaction = null;
        if (text != null && !text.isBlank()) {
            text = preProcessText(text);
            List<TransactionTextPattern> textPatterns = transactionTextPatternRepo.findAll();
            for (TransactionTextPattern textPattern : textPatterns) {
                transaction = parse(text, textPattern);
                if (transaction != null) {
                    break;
                }
            }
        }
        return transaction;
    }

    private String preProcessText(String text) {
        String processedText = text;
        if (text.startsWith(TransactionTextParams._DATE_.name())) {
            processedText = TransactionTextParams._DATE_.name() + DATE_DELIMITER +
                    text.substring(TransactionTextParams._DATE_.name().length());
        }
        return processedText;
    }

    private Transaction parse(String text, TransactionTextPattern textPattern) {
        Transaction transaction = null;
        if (text.contains(textPattern.getIdentifier())) {
            text = text.replaceAll("\n", " ");
            logger.debug("Text identified with pattern: {}", textPattern);

            // Delimit date value on transaction text
            if (textPattern.getPattern().startsWith(TransactionTextParams._DATE_.name())) {
                int index = text.indexOf(" ", TransactionTextParams._DATE_.name().length());

                if (text.charAt(index - 1) != DATE_DELIMITER.charAt(0)) {
                    text = text.substring(0, index) + DATE_DELIMITER + text.substring(index);
                }
            }
            logger.debug("Prepared transaction text: {}", text);

            String patternText = getPatternText(textPattern);
            logger.debug("Pattern Text: {} ", patternText);

            Map<String, Integer> paramIndex = findPatternValueIndex(textPattern);
            logger.debug("Parameter value index: {}", paramIndex);
            transaction = new Transaction();
            Pattern pattern = Pattern.compile(patternText);
            Matcher matcher = pattern.matcher(text);
            if (matcher.matches()) {
                if (getParamIndex(paramIndex, TransactionTextParams._AMOUNT_) > 0) {
                    String valueText = matcher.group(getParamIndex(paramIndex, TransactionTextParams._AMOUNT_));
                    valueText = valueText.replaceAll(",", "");
                    logger.debug("Amount: {} ", valueText);
                    transaction.setAmount(Double.parseDouble(valueText));
                }
                if (getParamIndex(paramIndex, TransactionTextParams._DATE_) > 0) {
                    DateTimeFormatterBuilder builder = new DateTimeFormatterBuilder();
                    builder.parseCaseInsensitive();
                    builder.appendPattern(textPattern.getDatePattern());
                    DateTimeFormatter dateFormat = builder.toFormatter();
                    transaction.setDate(LocalDate.parse(
                            matcher.group(getParamIndex(paramIndex, TransactionTextParams._DATE_)), dateFormat));
                }
                if (getParamIndex(paramIndex, TransactionTextParams._STORE_) > 0) {
                    transaction.setStore(matcher.group(getParamIndex(paramIndex, TransactionTextParams._STORE_)));
                }
            } else {
                logger.debug("Pattern not matched: {}", textPattern.getName());
            }
            if (textPattern.getOtherValues() != null) {
                transaction.setAccount(textPattern.getOtherValues().getAccount());
                transaction.setType(textPattern.getOtherValues().getType());
                transaction.setMode(textPattern.getOtherValues().getMode());
                transaction.setCategory(textPattern.getOtherValues().getCategory());
            }
            postProcessTransaction(transaction);
        }
        return transaction;
    }

    private void postProcessTransaction(Transaction transaction) {
        updateStoreParameters(transaction);
    }

    private void updateStoreParameters(Transaction transaction) {
        StoreMapping storeMapping = storeMappingRepo.findByStoreFound(transaction.getStore());
        if (storeMapping != null) {
            transaction.setStore(storeMapping.getMapToStore());
        }

        StoreParams storeParams = storeParamsRepo.findByStore(transaction.getStore());
        if (storeParams != null) {
            transaction.setDescription(storeParams.getDescription());
            transaction.setCategory(storeParams.getCategory());
            transaction.setSubCategory(storeParams.getSubcategory());
        }
    }

    private int getParamIndex(Map<String, Integer> paramIndex, TransactionTextParams params) {
        Integer index = paramIndex.get(params.name());
        return index != null ? index : -1;
    }

    private String getPatternText(TransactionTextPattern textPattern) {
        String patternString = textPattern.getPattern();
        String patternText = patternString.replaceAll(TransactionTextParams._SOMETHING_.name(), TransactionTextParams._SOMETHING_.value);
        patternText = patternText.replaceAll(TransactionTextParams._DATE_.name(), TransactionTextParams._DATE_.value);
        patternText = patternText.replaceAll(TransactionTextParams._AMOUNT_.name(), TransactionTextParams._AMOUNT_.value);
        patternText = patternText.replaceAll(TransactionTextParams._STORE_.name(), TransactionTextParams._STORE_.value);
        return patternText;
    }

    private Map<String, Integer> findPatternValueIndex(TransactionTextPattern textPattern) {
        Map<String, Integer> map = new HashMap<>();

        int fromIndex = 0;
        int paramIndex = 0;
        int currentIndex = textPattern.getPattern().indexOf("_", fromIndex);
        while (currentIndex >= 0) {
            int paramEndIndex = textPattern.getPattern().indexOf("_", currentIndex + 1);
            paramIndex++;
            String param = textPattern.getPattern().substring(currentIndex, paramEndIndex + 1);
            if (param.equals(TransactionTextParams._STORE_.name())) {
                map.put(TransactionTextParams._STORE_.name(), paramIndex);
            }
            if (param.equals(TransactionTextParams._AMOUNT_.name())) {
                map.put(TransactionTextParams._AMOUNT_.name(), paramIndex);
            }
            if (param.equals(TransactionTextParams._DATE_.name())) {
                map.put(TransactionTextParams._DATE_.name(), paramIndex);
            }
            fromIndex = paramEndIndex + 1;
            currentIndex = textPattern.getPattern().indexOf("_", fromIndex);
        }
        return map;
    }

    public TransactionTextPattern saveTextPattern(TransactionTextPattern textPattern) {
        validateTextPattern(textPattern);
        preProcessPattern(textPattern);
        return transactionTextPatternRepo.save(textPattern);
    }

    private void preProcessPattern(TransactionTextPattern textPattern) {
        if (textPattern.getPattern().startsWith(TransactionTextParams._DATE_.name())) {
            if (textPattern.getPattern().indexOf(DATE_DELIMITER) != TransactionTextParams._DATE_.name().length()) {
                String pattern = textPattern.getPattern();
                textPattern.setPattern(TransactionTextParams._DATE_.name() + DATE_DELIMITER +
                        pattern.substring(TransactionTextParams._DATE_.name().length()));
            }
        }
    }

    private void validateTextPattern(TransactionTextPattern textPattern) {
        if (textPattern == null) {
            logger.error("Text Pattern is null");
            throw new InvalidDataException("Text Pattern is null");
        }
        if (textPattern.getPattern() == null || textPattern.getPattern().isBlank()) {
            logger.error("Text Pattern is blank");
            throw new InvalidDataException("Text Pattern is blank");
        }
        if (textPattern.getName() == null || textPattern.getName().isBlank()) {
            logger.error("Text Pattern's name is blank");
            throw new InvalidDataException("Text Pattern's name is blank");
        }
        if (textPattern.getIdentifier() == null || textPattern.getIdentifier().isBlank()) {
            logger.error("Text Pattern's identifier is blank");
            throw new InvalidDataException("Text Pattern's identifier is blank");
        }
        TransactionTextPattern patternByName = transactionTextPatternRepo.findByName(textPattern.getName());
        if (patternByName != null && !patternByName.getId().equals(textPattern.getId())) {
            logger.error("Text Pattern's name already exists");
            throw new InvalidDataException("Text Pattern's name already exists");
        }
        if (textPattern.getPattern().indexOf(TransactionTextParams._DATE_.name()) >= 0 &&
                (textPattern.getDatePattern() == null || textPattern.getDatePattern().isBlank())) {
            logger.error("Date pattern is blank");
            throw new InvalidDataException("Date pattern is blank");
        }
    }

    public TransactionTextPattern updateTextPattern(TransactionTextPattern textPattern) {
        transactionTextPatternRepo.findById(textPattern.getId()).orElseThrow();
        validateTextPattern(textPattern);
        preProcessPattern(textPattern);
        return transactionTextPatternRepo.save(textPattern);
    }

    public TransactionTextPattern getTextPattern(String id) {
        return transactionTextPatternRepo.findById(id).orElseThrow();
    }

    public TransactionTextPattern deleteTextPattern(String id) {
        TransactionTextPattern textPattern = transactionTextPatternRepo.findById(id).orElseThrow();
        transactionTextPatternRepo.delete(textPattern);
        return textPattern;
    }

    public List<TransactionTextPattern> getAllTextPattern() {
        return transactionTextPatternRepo.findAll();
    }

    public StoreMappingList getAllStoreMappings() {
        return new StoreMappingList(storeMappingRepo.findAll());
    }

    public StoreMapping saveStoreMapping(StoreMapping storeMapping) {
        if (storeMapping == null) {
            throw new InvalidDataException("Store Mapping is null");
        }
        if (storeMapping.getStoreFound() == null || storeMapping.getStoreFound().isBlank()) {
            throw new InvalidDataException("Store found can not be blank");
        }
        if (storeMapping.getMapToStore() == null || storeMapping.getMapToStore().isBlank()) {
            throw new InvalidDataException("Map to store can not be blank");
        }
        if (storeMappingRepo.findByStoreFound(storeMapping.getStoreFound()) != null) {
            throw new InvalidDataException("Mapping already exists for this store");
        }
        return storeMappingRepo.save(storeMapping);
    }

    public StoreMapping deleteStoreMapping(String id) {
        StoreMapping storeMapping;
        try {
            storeMapping = storeMappingRepo.findById(id).orElseThrow();
            storeMappingRepo.delete(storeMapping);
        } catch (NoSuchElementException e) {
            throw new InvalidDataException("No store mapping found with id: " + id);
        }
        return storeMapping;
    }

    public StoreParamsList getAllStoreParams() {
        return new StoreParamsList(storeParamsRepo.findAll());
    }

    public StoreParams saveStoreParams(StoreParams storeParams) {
        if (storeParams == null) {
            throw new InvalidDataException("Store Params is null");
        }
        if (storeParams.getStore() == null || storeParams.getStore().isBlank()) {
            throw new InvalidDataException("Store can not be blank");
        }
        if (storeParamsRepo.findByStore(storeParams.getStore()) != null) {
            throw new InvalidDataException("Mapping already exists for this store");
        }
        return storeParamsRepo.save(storeParams);
    }

    public StoreParams deleteStoreParams(String id) {
        StoreParams storeParams;
        try {
            storeParams = storeParamsRepo.findById(id).orElseThrow();
            storeParamsRepo.delete(storeParams);
        } catch (NoSuchElementException e) {
            throw new InvalidDataException("No store params found with id: " + id);
        }
        return storeParams;
    }

    // Dirty Testing
    public static void main(String[] args) {
        TransactionTextService transactionTextService = new TransactionTextService();

        TransactionTextPattern textPattern = new TransactionTextPattern();
        textPattern.setIdentifier("ICICI Bank Credit Card");
        textPattern.setPattern("_SOMETHING_ ICICI Bank Credit Card _SOMETHING_ INR _AMOUNT_ on _DATE_ at _SOMETHING_ Info: _STORE_.");
        textPattern.setDatePattern("MMM dd, yyyy");
        Transaction values = new Transaction();
        values.setType("debit");
        values.setAccount("ICICI CC");
        values.setMode("Card");
        textPattern.setOtherValues(values);
        Transaction transaction = transactionTextService.parse(
                "Your ICICI Bank Credit Card XX1234 has been used for a transaction of INR 147.76 on Mar 10, 2023 at 07:38:41. Info: VIJETHA SUPERMARKETS P.",
                textPattern);
        System.out.println(transaction);

        textPattern = new TransactionTextPattern();
        textPattern.setIdentifier("HDFC Bank Credit Card");
        textPattern.setPattern("_SOMETHING_ HDFC Bank Credit Card _SOMETHING_ for Rs _AMOUNT_ at _STORE_ on _DATE_ _SOMETHING_.");
        textPattern.setDatePattern("dd-MM-yyyy");
        values = new Transaction();
        values.setType("debit");
        values.setAccount("HDFC CC");
        values.setMode("Card");
        textPattern.setOtherValues(values);
        transaction = transactionTextService.parse(
                "Thank you for using your HDFC Bank Credit Card ending 9830 for Rs 138.10 at VIJETHA SUPERMARKETS P on 11-03-2023 16:26:38.",
                textPattern);
        System.out.println(transaction);

        textPattern = new TransactionTextPattern();
        textPattern.setIdentifier("HDFC Bank NetBanking");
        textPattern.setPattern("This is to inform you that an amount of Rs. _AMOUNT_ has been debited _SOMETHING_");
        values = new Transaction();
        values.setType("debit");
        values.setAccount("HDFC SB");
        values.setMode("NEFT");
        textPattern.setOtherValues(values);
        transaction = transactionTextService.parse(
                "This is to inform you that an amount of Rs. 18,000.00 has been debited from your account No. XXXX12345 on account of National Electronic Funds Transfer transaction using HDFC Bank NetBanking.",
                textPattern);
        System.out.println(transaction);
    }
}
