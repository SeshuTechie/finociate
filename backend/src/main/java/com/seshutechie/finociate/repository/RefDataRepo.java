package com.seshutechie.finociate.repository;

import com.seshutechie.finociate.model.RefData;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RefDataRepo extends MongoRepository<RefData, String> {
    List<RefData> findAllByKey(String key);
    List<RefData> findByKeyAndValueContainingIgnoreCase(String key, String value);
}
