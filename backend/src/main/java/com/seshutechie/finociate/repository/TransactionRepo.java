package com.seshutechie.finociate.repository;

import com.seshutechie.finociate.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Date;
import java.util.List;

public interface TransactionRepo extends MongoRepository<Transaction, String> {
    List<Transaction> findAllByDateBetween(Date startDate, Date endDate);
}
