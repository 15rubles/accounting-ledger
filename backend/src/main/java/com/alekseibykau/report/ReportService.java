package com.alekseibykau.report;

import com.alekseibykau.report.dto.ReportResponse;
import com.alekseibykau.transaction.TransactionRepository;
import com.alekseibykau.transaction.dto.TransactionResponse;
import com.alekseibykau.transaction.entity.Transaction;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Clock;
import java.time.LocalDate;
import java.util.List;
import java.util.function.Predicate;

@Service
@AllArgsConstructor
public class ReportService {

    private final TransactionRepository transactionRepository;
    private final Clock clock;

    public ReportResponse generateByPeriod(ReportPeriod period) {
        DateRange range = period.range(LocalDate.now(clock));

        List<Transaction> transactions = transactionRepository.findInRange(
                range.from().atStartOfDay(),
                range.to().plusDays(1).atStartOfDay());

        return buildReport(period.name(), range.from(), range.to(), transactions);
    }

    public ReportResponse generateByVendor(String vendor) {
        Sort sort = Sort.by(Sort.Direction.DESC, "occurredAt", "id");

        List<Transaction> transactions = transactionRepository.findByVendorContainingIgnoreCase(vendor, sort);

        LocalDate from = transactions.isEmpty() ? null : transactions.getLast().getOccurredAt().toLocalDate();
        LocalDate to = transactions.isEmpty() ? null : transactions.getFirst().getOccurredAt().toLocalDate();

        return buildReport("Vendor: " + vendor, from, to, transactions);
    }

    private ReportResponse buildReport(String title, LocalDate from, LocalDate to,
                                       List<Transaction> transactions) {
        List<TransactionResponse> responses = transactions.stream()
                                                .map(TransactionResponse::from).toList();
        BigDecimal deposits = sumDeposits(transactions);
        BigDecimal payments = sumPayments(transactions);
        return new ReportResponse(title, from, to, deposits, payments, deposits.add(payments), responses);
    }

    private BigDecimal sumDeposits(List<Transaction> transactions) {
        return sum(transactions, a -> a.signum() > 0);
    }

    private BigDecimal sumPayments(List<Transaction> transactions) {
        return sum(transactions, a -> a.signum() < 0);
    }

    private BigDecimal sum(List<Transaction> transactions, Predicate<BigDecimal> condition) {
        return transactions.stream()
                .map(Transaction::getAmount)
                .filter(condition)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
