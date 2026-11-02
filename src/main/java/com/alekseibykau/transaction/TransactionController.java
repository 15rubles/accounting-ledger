package com.alekseibykau.transaction;

import com.alekseibykau.transaction.entity.Transaction;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@AllArgsConstructor
@RequestMapping("/transactions")
public class TransactionController {
    private final TransactionService transactionService;

    @GetMapping("/all")
    public ArrayList<Transaction> getAll() {
        return transactionService.findAll();
    }

    @PostMapping("/")
    public Transaction save(
            @Valid @RequestBody Transaction transaction)
    {
        return transactionService.save(transaction);
    }
}
