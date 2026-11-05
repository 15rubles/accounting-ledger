package com.alekseibykau.transaction.dto;

import com.alekseibykau.transaction.entity.Transaction;
import com.alekseibykau.transaction.entity.TransactionType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public record TransactionRequest(
        @NotBlank(message = "Description is required")
        @Size(max = 255, message = "Description must be at most 255 characters")
        String description,

        @NotBlank(message = "Vendor is required")
        @Size(max = 100, message = "Vendor must be at most 100 characters")
        String vendor,

        @NotNull(message = "Amount is required")
        @Digits(integer = 100, fraction = 2, message = "Amount must have at most 2 decimal places")
        BigDecimal amount,

        @PastOrPresent(message = "Date cannot be in the future")
        LocalDate date,

        LocalTime time
) {
    public Transaction toEntity(Clock clock) {
        LocalDate resolvedDate = date != null ? date : LocalDate.now(clock);
        LocalTime resolvedTime = time != null ? time : LocalTime.now(clock).withNano(0);
        Transaction transaction = new Transaction();
        transaction.setOccurredAt(LocalDateTime.of(resolvedDate, resolvedTime));
        transaction.setDescription(description.trim());
        transaction.setVendor(vendor.trim());
        transaction.setAmount(amount);
        return transaction;
    }

}
