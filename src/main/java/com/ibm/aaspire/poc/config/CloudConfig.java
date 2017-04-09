package com.ibm.aaspire.poc.config;

import org.springframework.cloud.config.java.AbstractCloudConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.mongodb.MongoDbFactory;

@Configuration
@Profile({ "dev", "test", "prod" })
public class CloudConfig extends AbstractCloudConfig {
  @Bean
  public MongoDbFactory documentMongoDbFactory() {
      return connectionFactory().mongoDbFactory();
  }
}
