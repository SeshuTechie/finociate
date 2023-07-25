package com.seshutechie.finociate.repository;

import com.seshutechie.finociate.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Date;
import java.util.List;

public interface TransactionRepo extends MongoRepository<Transaction, String> {
    @Query("{'date' : { $gte: ?0, $lte: ?1 } }")
    List<Transaction> findAllByDateBetween(Date startDate, Date endDate);
}
