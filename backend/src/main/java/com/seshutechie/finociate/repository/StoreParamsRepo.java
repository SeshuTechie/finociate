package com.seshutechie.finociate.repository;

import com.seshutechie.finociate.model.StoreParams;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StoreParamsRepo extends MongoRepository<StoreParams, String> {
    StoreParams findByStore(String store);
}
