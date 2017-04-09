package com.ibm.aaspire.poc.config;

import java.security.cert.CertificateFactory;
import java.util.Base64;

import java.io.ByteArrayInputStream;
import java.security.KeyStore;
import java.security.cert.Certificate;
import java.security.cert.CertificateFactory;
import java.util.Base64;
 
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManagerFactory;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.config.java.AbstractCloudConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
 
import com.mongodb.MongoClientOptions;
import org.springframework.data.mongodb.MongoDbFactory;


@Configuration
@Profile({ "dev", "test", "prod" })
public class CloudConfig extends AbstractCloudConfig {

	private String mongoUri;

	private String sslCertBase64;

	@Autowired
	public CloudConfig(@Value("${vcap.services.mongodb-devicestate.credentials.uri}") String mongoUri,
			@Value("${vcap.services.mongodb-devicestate.credentials.ca_certificate_base64}") String sslCertBase64) {
		this.mongoUri = mongoUri;
		this.sslCertBase64 = sslCertBase64;
	}

	// Taken from http://codegists.com/snippet/java/cloudconfigurationjava_joelmarty_java
    @Bean
    public MongoClientOptions mongoClientOptions() throws Exception {
        boolean sslEnabled = mongoUri.contains("ssl=true");
        MongoClientOptions.Builder optionsBuilder = MongoClientOptions.builder();
        if (sslEnabled) {
            optionsBuilder.sslEnabled(true).sslInvalidHostNameAllowed(true);
            byte[] caCertBytes = Base64.getDecoder().decode(sslCertBase64);
            CertificateFactory certificateFactory = CertificateFactory.getInstance("X.509");
            Certificate caCert = certificateFactory.generateCertificate(new ByteArrayInputStream(caCertBytes));
 
            KeyStore trustStore = KeyStore.getInstance(KeyStore.getDefaultType());
            trustStore.load(null, null);
            trustStore.setCertificateEntry("bluemix_mongo", caCert);
 
            TrustManagerFactory tmf = TrustManagerFactory.getInstance(TrustManagerFactory.getDefaultAlgorithm());
            tmf.init(trustStore);
 
            SSLContext sslContext = SSLContext.getInstance("TLS");
            sslContext.init(null, tmf.getTrustManagers(), null);
 
            SSLSocketFactory socketFactory = sslContext.getSocketFactory();
            optionsBuilder.socketFactory(socketFactory);
        }
        return optionsBuilder.build();
    }
	
	
	@Bean
	public MongoDbFactory documentMongoDbFactory() {
		return connectionFactory().mongoDbFactory();
	}
}
