package com.seshutechie.finociate.service;

import com.seshutechie.finociate.exception.RefDataNotFoundException;
import com.seshutechie.finociate.model.RefData;
import com.seshutechie.finociate.repository.RefDataRepo;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.MissingFormatArgumentException;
import java.util.NoSuchElementException;

@Service
public class RefDataService {
    private static final Logger logger = LoggerFactory.getLogger(RefDataService.class);

    @Autowired
    private RefDataRepo refDataRepo;

    public List<RefData> getRefDataList(String key, String valueLike) {
        List<RefData> refDataList = null;
        if (key != null && !key.isEmpty()) {
            if (valueLike == null) {
                refDataList = refDataRepo.findAllByKey(key);
            } else {
                refDataList = refDataRepo.findByKeyAndValueContainingIgnoreCase(key, valueLike);
            }
        } else {
            refDataList = refDataRepo.findAll();
        }
        return refDataList;
    }

    public RefData saveRefData(RefData refData) {
        if (refData == null || refData.getKey() == null || refData.getKey().trim().isEmpty()
                || refData.getValue() == null || refData.getValue().trim().isEmpty()) {
            throw new MissingFormatArgumentException("Both key and value are required");
        }
        return refDataRepo.save(refData);
    }

    public RefData updateRefData(RefData refData) {
        try {
            refDataRepo.findById(refData.getId()).orElseThrow();
        } catch (NoSuchElementException ex) {
            throw new RefDataNotFoundException(refData.getId());
        }
        return refDataRepo.save(refData);
    }

    public RefData deleteRefData(String id) {
        RefData refData = getRefData(id);
        if (refData != null) {
            refDataRepo.deleteById(id);
        }
        return refData;
    }

    public RefData getRefData(String id) {
        RefData refData = null;
        try {
            refData = refDataRepo.findById(id).orElseThrow();
        } catch (NoSuchElementException ex) {
            throw new RefDataNotFoundException(id);
        }
        return refData;
    }
}
