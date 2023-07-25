package com.seshutechie.finociate.repository;

import com.seshutechie.finociate.model.BudgetItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Date;
import java.util.List;

public interface BudgetItemRepo extends MongoRepository<BudgetItem, String> {
    @Query("{'date' : { $gte: ?0, $lte: ?1 } }")
    List<BudgetItem> findAllByDateBetween(Date startDate, Date endDate);
    List<BudgetItem> findAllByDate(Date date);

    List<BudgetItem> findByDateAndAccountAndType(Date date, String account, String type);
}
