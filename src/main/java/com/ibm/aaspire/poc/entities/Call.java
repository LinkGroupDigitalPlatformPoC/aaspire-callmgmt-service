package com.ibm.aaspire.poc.entities;

import java.util.Date;

import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.annotation.Id;

@Document(collection = "calls")
public class Call {

	public Call(String id, String memberId, Date time, String notes) {
		setId(id);
		setMemberId(memberId);
		setTime(time);
		setNotes(notes);
	}

	public Call() {
	}

	@Id
	private String id;
	
	private String memberId;
	
	private Date time;
	
	private String notes;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getMemberId() {
		return memberId;
	}

	public void setMemberId(String memberId) {
		this.memberId = memberId;
	}

	public Date getTime() {
		return time;
	}

	public void setTime(Date time) {
		this.time = time;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}
}
