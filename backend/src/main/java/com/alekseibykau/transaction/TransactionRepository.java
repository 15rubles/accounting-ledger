package com.alekseibykau.transaction;

import com.alekseibykau.transaction.entity.Transaction;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {

    List<Transaction> findByAmountGreaterThan(BigDecimal amount, Sort sort);

    List<Transaction> findByAmountLessThan(BigDecimal amount, Sort sort);

    List<Transaction> findByVendorContainingIgnoreCase(String vendor, Sort sort);

    @Query("""
        select t from Transaction t
        where t.occurredAt >= :start and t.occurredAt < :end
        order by t.occurredAt desc, t.id desc
        """)
    List<Transaction> findInRange(@Param("start") LocalDateTime start,
                                  @Param("end") LocalDateTime end);
}