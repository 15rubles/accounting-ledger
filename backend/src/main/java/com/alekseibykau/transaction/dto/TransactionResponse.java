package com.alekseibykau.transaction.dto;

import com.alekseibykau.transaction.entity.Transaction;
import com.alekseibykau.transaction.entity.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public record TransactionResponse(
        Long id,
        LocalDate date,
        LocalTime time,
        String description,
        String vendor,
        BigDecimal amount,
        TransactionType type
) {
    public static TransactionResponse from(Transaction t) {
        return new TransactionResponse(
                t.getId(),
                t.getOccurredAt().toLocalDate(),
                t.getOccurredAt().toLocalTime(),
                t.getDescription(),
                t.getVendor(),
                t.getAmount(),
                t.getAmount().signum() > 0 ? TransactionType.DEPOSIT : TransactionType.PAYMENT);
    }
}
