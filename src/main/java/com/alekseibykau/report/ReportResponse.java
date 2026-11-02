package com.alekseibykau.report;

import com.alekseibykau.transaction.entity.Transaction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record ReportResponse(
        String title,
        LocalDate from,
        LocalDate to,
        BigDecimal totalDeposits,
        BigDecimal totalPayments,
        BigDecimal net,
        List<Transaction> transactions
) {}
