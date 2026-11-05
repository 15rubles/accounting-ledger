package com.alekseibykau.transaction;

import com.alekseibykau.transaction.dto.TransactionSearchCriteria;
import com.alekseibykau.transaction.entity.Transaction;
import com.alekseibykau.transaction.entity.TransactionType;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@AllArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;

    public List<Transaction> findAll(TransactionType type) {
        Sort sort = Sort.by(Sort.Direction.DESC, "occurredAt", "id");
        if (type == null) return transactionRepository.findAll(sort);
        return switch (type) {
            case DEPOSIT -> transactionRepository.findByAmountGreaterThan(BigDecimal.ZERO, sort);
            case PAYMENT -> transactionRepository.findByAmountLessThan(BigDecimal.ZERO, sort);
        };
    }

    public Transaction save(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public List<Transaction> search(TransactionSearchCriteria criteria) {
        return transactionRepository.findAll(
                TransactionSpecifications.matches(criteria),
                Sort.by(Sort.Direction.DESC, "occurredAt", "id"));
    }



}
