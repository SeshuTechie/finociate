package com.seshutechie.finociate.repository;

import com.seshutechie.finociate.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Date;
import java.util.List;

public interface TransactionRepo extends MongoRepository<Transaction, String> {
//    @Query("SELECT new com.seshutechie.finociate.model.TransactionSummary(c.year, COUNT(c.year)) FROM Transaction AS c GROUP BY c.year ORDER BY c.year DESC")
//    int totalCommentsByYearClass();

    List<Transaction> findAllByDateBetween(Date startDate, Date endDate);
}
