package com.ibm.aaspire.poc.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.ibm.aaspire.poc.entities.Call;

public interface CallRespository extends MongoRepository<Call, String>  {

    public Call findById(String id);
    
    public List<Call> findByMemberId(String memberId);
}
