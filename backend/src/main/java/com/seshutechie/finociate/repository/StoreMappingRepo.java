package com.seshutechie.finociate.repository;

import com.seshutechie.finociate.model.StoreMapping;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StoreMappingRepo extends MongoRepository<StoreMapping, String> {
    StoreMapping findByStoreFound(String storeFound);
}
