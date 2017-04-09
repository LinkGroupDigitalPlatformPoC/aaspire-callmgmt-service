package com.ibm.aaspire.poc.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.ibm.aaspire.poc.entities.Call;
import com.ibm.aaspire.poc.repository.CallRespository;

@RestController
public class CallController {

	@Autowired
	private CallRespository repository;
	
	@GetMapping("/calls")
	public Iterable<Call> getCalls() {
		return repository.findAll();
	}
	
	@RequestMapping(value="/calls/{id}", method=RequestMethod.GET)
	public Call getCall(@PathVariable String id) {
		return repository.findById(id);
	}
	
	@RequestMapping(value="/members/{memberId}/calls", method=RequestMethod.GET)
	public Iterable<Call> getMemberCalls(@PathVariable String memberId) {
		return repository.findByMemberId(memberId);
	}
}
