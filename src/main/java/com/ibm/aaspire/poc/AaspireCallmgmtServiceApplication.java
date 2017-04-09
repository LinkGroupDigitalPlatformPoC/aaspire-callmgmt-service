package com.ibm.aaspire.poc;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.Environment;

import com.ibm.aaspire.poc.entities.Call;
import com.ibm.aaspire.poc.repository.CallRespository;

@SpringBootApplication
public class AaspireCallmgmtServiceApplication implements CommandLineRunner {

	@Autowired
	CallRespository repo;
	
	@Autowired
	private Environment environment;
	
	public static void main(String[] args) {
		SpringApplication.run(AaspireCallmgmtServiceApplication.class, args);
	}

	@Override
	public void run(String... arg0) throws Exception {
		// TODO different init logic based on this.environment??
		// Initialise repo data ...
		Call[] initData = {
				new Call("call1", "201", new Date(), "They called us"),
				new Call("call2", "202", new Date(), "They called us"),
				new Call("call3", "203", new Date(), "They called us"),
				new Call("call4", "204", new Date(), "They called us"),
				new Call("call5", "205", new Date(), "They called us"),
				new Call("call6", "206", new Date(), "They called us"),
				new Call("call7", "207", new Date(), "They called us"),
				new Call("call8", "208", new Date(), "They called us"),
				new Call("call9", "209", new Date(), "They called us"),
				new Call("call10", "210", new Date(), "They called us"),
				new Call("call11", "201", new Date(), "They called us"),
				new Call("call12", "202", new Date(), "They called us"),
				new Call("call13", "203", new Date(), "They called us"),
		};
		
		for(Call c: initData) {
			if(repo.findById(c.getId()) == null) {
				repo.insert(c);
			}
		}
	}
}
