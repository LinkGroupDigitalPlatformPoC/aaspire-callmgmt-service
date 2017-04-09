package com.ibm.aaspire.poc.config;

import java.security.cert.CertificateFactory;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.io.ByteArrayInputStream;
import java.security.KeyStore;
import java.security.cert.Certificate;
 
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManagerFactory;
 
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.json.JsonParser;
import org.springframework.boot.json.JsonParserFactory;
import org.springframework.cloud.config.java.AbstractCloudConfig;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
 
import com.mongodb.MongoClientOptions;
import org.springframework.data.mongodb.MongoDbFactory;


@Configuration
@Profile({ "dev", "test", "prod" })
public class SSLConfig extends AbstractCloudConfig {

	// Taken from http://codegists.com/snippet/java/cloudconfigurationjava_joelmarty_java
    @Bean
    @SuppressWarnings("unchecked")
    public MongoClientOptions mongoClientOptions() throws Exception {
		String vcap = System.getenv("VCAP_SERVICES");

		JsonParser parser = JsonParserFactory.getJsonParser();
		Map<String, Object> jsonMap = parser.parseMap(vcap);
		List<?> mongoAddr = (List<?>)jsonMap.get("compose-for-mongodb");
		Map<String, ?> compose = (Map<String, Object>)mongoAddr.get(0);
		Map<String, ?> creds = (Map<String, ?>)compose.get("credentials");
		String mongoUri = creds.get("uri").toString(); 
		String sslCertBase64 = creds.get("ca_certificate_base64").toString();
    	
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
}
