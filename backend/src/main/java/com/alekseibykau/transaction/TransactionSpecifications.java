package com.alekseibykau.transaction;

import com.alekseibykau.transaction.dto.TransactionSearchCriteria;
import com.alekseibykau.transaction.entity.Transaction;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public final class TransactionSpecifications {

    private TransactionSpecifications() {}

    public static Specification<Transaction> matches(TransactionSearchCriteria c) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (c.startDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(
                        root.get("occurredAt"), c.startDate().atStartOfDay()));
            }
            if (c.endDate() != null) {
                predicates.add(cb.lessThan(
                        root.get("occurredAt"), c.endDate().plusDays(1).atStartOfDay()));
            }
            if (hasText(c.description())) {
                predicates.add(cb.like(
                        cb.lower(root.get("description")),
                        "%" + c.description().toLowerCase() + "%"));
            }
            if (hasText(c.vendor())) {
                predicates.add(cb.like(
                        cb.lower(root.get("vendor")),"%" + c.vendor().toLowerCase() + "%"));
            }
            if (c.minAmount() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("amount"), c.minAmount()));
            }
            if (c.maxAmount() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("amount"), c.maxAmount()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static boolean hasText(String s) {
        return s != null && !s.isBlank();
    }
}