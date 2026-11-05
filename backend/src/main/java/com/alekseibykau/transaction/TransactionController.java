package com.alekseibykau.transaction;

import com.alekseibykau.transaction.dto.TransactionRequest;
import com.alekseibykau.transaction.dto.TransactionResponse;
import com.alekseibykau.transaction.dto.TransactionSearchCriteria;
import com.alekseibykau.transaction.entity.TransactionType;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.Clock;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/transactions")
public class TransactionController {
    private final TransactionService transactionService;
    private final Clock clock;

    @GetMapping
    public List<TransactionResponse> getAll(@RequestParam(required = false) TransactionType type) {
        return transactionService.findAll(type).stream()
                .map(TransactionResponse::from)
                .toList();
    }

    @PostMapping
    public TransactionResponse save(
            @Valid @RequestBody TransactionRequest transactionRequest)
    {
        return TransactionResponse.from(transactionService.save(transactionRequest.toEntity(clock)));
    }

    @GetMapping("/search")
    public List<TransactionResponse> search(TransactionSearchCriteria criteria) {
        return transactionService.search(criteria).stream()
                .map(TransactionResponse::from)
                .toList();
    }
}
