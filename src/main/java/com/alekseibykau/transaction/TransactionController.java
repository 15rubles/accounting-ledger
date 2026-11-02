package com.alekseibykau.transaction;

import com.alekseibykau.transaction.dto.TransactionSearchCriteria;
import com.alekseibykau.transaction.entity.Transaction;
import com.alekseibykau.transaction.entity.TransactionType;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/transactions")
public class TransactionController {
    private final TransactionService transactionService;

    @GetMapping
    public List<Transaction> getAll(@RequestParam(required = false) TransactionType type) {
        return transactionService.findAll(type);
    }

    @PostMapping
    public Transaction save(
            @Valid @RequestBody Transaction transaction)
    {
        return transactionService.save(transaction);
    }

    @GetMapping("/search")
    public List<Transaction> search(TransactionSearchCriteria criteria) {
        return transactionService.search(criteria);
    }
}
