package com.seshutechie.finociate.service;

import com.seshutechie.finociate.model.Transaction;
import net.rationalminds.LocalDateModel;
import net.rationalminds.Parser;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class TransactionParser {
    private static final Logger logger = LoggerFactory.getLogger(TransactionParser.class);

    static class DateModel {
        LocalDate date;
        int start;
        int end;

        @Override
        public String toString() {
            return "DateModel{" +
                    "date=" + date +
                    ", start=" + start +
                    ", end=" + end +
                    '}';
        }
    }

    private DateModel extractDate(String text) {
        Parser parser = new Parser();
        List<LocalDateModel> dates = parser.parse(text);
        DateModel result = null;
        if(dates != null && dates.size() > 0) {
            LocalDateModel dateModel = dates.get(0);
            logger.debug("DateModel Found: {}", dateModel);
            try {
                result = new DateModel();
                result.date = LocalDate.parse(dateModel.getOriginalText(), DateTimeFormatter.ofPattern(dateModel.getIdentifiedDateFormat()));
                result.start = dateModel.getStart();
                result.end = dateModel.getEnd();
            } catch (DateTimeParseException | IllegalArgumentException e) {
                logger.error("Parse exception while finding date", e);
            }
        } else {
            logger.warn("No Date Found from text {}", text);
        }
        return result;
    }

    private double extractAmount(String text, int dateStart, int dateEnd) {
        Pattern numberPattern = Pattern.compile("-?\\d+(\\.\\d+)?");
        Matcher matcher = numberPattern.matcher(text);

        List<String> numberList = new ArrayList<>();
        while (matcher.find()) {
            if(!(matcher.start() >= dateStart - 1 && matcher.start() <= dateEnd - 1)) {
                logger.debug("date start/end: {} - {}. match {}", dateStart, dateEnd, matcher.start());
                numberList.add(matcher.group());
            }
        }
        logger.debug("Found numbers from text: {}", numberList);
        return numberList.size() > 0 ? Double.parseDouble(numberList.get(0)) : 0;
    }


    public Transaction parseTransaction(String text) {
        Transaction transaction = new Transaction();

        DateModel dateModel = extractDate(text);
        transaction.setDate(dateModel.date);

        double amount = extractAmount(text, dateModel.start, dateModel.end);
        transaction.setAmount(amount);

        return transaction;
    }

}
