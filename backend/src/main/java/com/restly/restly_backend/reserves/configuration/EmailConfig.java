package com.restly.restly_backend.reserves.configuration;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

@Configuration
public class EmailConfig {

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.gmail.com");
        mailSender.setPort(587);
        mailSender.setUsername("restly.envios@gmail.com");
        mailSender.setPassword("vsng gdab htzs ugbn");


        mailSender.getJavaMailProperties().setProperty("mail.smtp.auth", "true");
        mailSender.getJavaMailProperties().setProperty("mail.smtp.starttls.enable", "true");
        mailSender.getJavaMailProperties().setProperty("mail.smtp.timeout", "5000");
        mailSender.getJavaMailProperties().setProperty("mail.smtp.connectiontimeout", "5000");

        return mailSender;
    }
}