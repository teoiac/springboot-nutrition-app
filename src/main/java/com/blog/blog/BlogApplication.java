package com.blog.blog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.net.URI;

@SpringBootApplication
public class BlogApplication {
	public static void main(String[] args) {
		String databaseUrl = System.getenv("DATABASE_URL");

		if (databaseUrl != null && databaseUrl.startsWith("postgres://")) {
			try {
				URI dbUri = new URI(databaseUrl);
				String username = dbUri.getUserInfo().split(":")[0];
				String password = dbUri.getUserInfo().split(":")[1];
				String dbUrl = "jdbc:postgresql://" + dbUri.getHost() + ':' + dbUri.getPort() + dbUri.getPath();

				System.setProperty("spring.datasource.url", dbUrl);
				System.setProperty("spring.datasource.username", username);
				System.setProperty("spring.datasource.password", password);
			} catch (Exception e) {
				System.err.println("Eroare la parsarea DATABASE_URL: " + e.getMessage());
			}
		}

		SpringApplication.run(BlogApplication.class, args);
	}
}