package com.alekseibykau.transaction;

import com.alekseibykau.transaction.entity.Transaction;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {

    List<Transaction> findByAmountGreaterThan(BigDecimal amount, Sort sort);

    List<Transaction> findByAmountLessThan(BigDecimal amount, Sort sort);
}