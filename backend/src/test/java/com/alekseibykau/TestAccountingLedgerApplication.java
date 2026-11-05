package com.alekseibykau;

import org.springframework.boot.SpringApplication;

public class TestAccountingLedgerApplication {

    public static void main(String[] args) {
        SpringApplication.from(AccountingLedgerApplication::main).with(TestcontainersConfiguration.class).run(args);
    }

}
