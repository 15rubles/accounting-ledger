package com.alekseibykau.transaction;

import com.alekseibykau.transaction.entity.Transaction;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@AllArgsConstructor
public class TransactionService {
    private final TransactionRepository transactionRepository;

    public ArrayList<Transaction> findAll() {
        return (ArrayList<Transaction>) transactionRepository.findAll();
    }

    public Transaction save(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

}
