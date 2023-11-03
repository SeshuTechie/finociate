package com.seshutechie.finociate.repository;

import com.seshutechie.finociate.model.TransactionTextPattern;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TransactionTextPatternRepo  extends MongoRepository<TransactionTextPattern, String> {
    TransactionTextPattern findByName(String name);
}
