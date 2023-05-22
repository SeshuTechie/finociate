package com.seshutechie.finociate.service;

import com.seshutechie.finociate.model.Transaction;
import com.seshutechie.finociate.model.TransactionTextParams;
import com.seshutechie.finociate.model.TransactionTextPattern;
import com.seshutechie.finociate.repository.TransactionTextPatternRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class TransactionTextService {
    private static final Logger logger = LoggerFactory.getLogger(TransactionTextService.class);

    @Autowired
    TransactionTextPatternRepo transactionTextPatternRepo;

    public Transaction parseTransaction(String text) {
        Transaction transaction = null;
        List<TransactionTextPattern> textPatterns = transactionTextPatternRepo.findAll();
        for (TransactionTextPattern textPattern : textPatterns ) {
            transaction = parse(text, textPattern);
            if (transaction != null) {
                break;
            }
        }
        return transaction;
    }

    private Transaction parse(String text, TransactionTextPattern textPattern) {
        Transaction transaction = null;
        if (text.contains(textPattern.getIdentifier())) {
            logger.debug("Text identified with pattern: {}", textPattern);
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
                    transaction.setDate(LocalDate.parse(matcher.group(getParamIndex(paramIndex, TransactionTextParams._DATE_)), DateTimeFormatter.ofPattern(textPattern.getDatePattern())));
                }
                if (getParamIndex(paramIndex, TransactionTextParams._STORE_) > 0) {
                    transaction.setStore(matcher.group(getParamIndex(paramIndex, TransactionTextParams._STORE_)));
                }
            }
            if (textPattern.getOtherValues() != null) {
                transaction.setAccount(textPattern.getOtherValues().getAccount());
                transaction.setType(textPattern.getOtherValues().getType());
                transaction.setMode(textPattern.getOtherValues().getMode());
            }
        }
        return transaction;
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
        return transactionTextPatternRepo.save(textPattern);
    }

    public TransactionTextPattern updateTextPattern(TransactionTextPattern textPattern) {
        transactionTextPatternRepo.findById(textPattern.getId()).orElseThrow();
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

    public List<TransactionTextPattern> getAllTextPattern() {
        return transactionTextPatternRepo.findAll();
    }
}
