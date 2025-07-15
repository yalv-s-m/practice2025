package com.example.demo;

import com.example.demo.service.CustomerService;
import com.example.demo.service.LotService;
import org.jooq.DSLContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ServiceConfig {

    @Bean
    public CustomerService customerService(DSLContext dsl) {
        return new CustomerService(dsl);
    }

    @Bean
    public LotService lotService(DSLContext dsl) {
        return new LotService(dsl);
    }
}

