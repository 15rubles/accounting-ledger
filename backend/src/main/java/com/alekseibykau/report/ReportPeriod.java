package com.alekseibykau.report;

import java.time.LocalDate;
import java.time.Year;
import java.time.YearMonth;
import java.util.Arrays;
import java.util.Optional;

public enum ReportPeriod {

    MONTH_TO_DATE("month-to-date") {
        @Override
        public DateRange range(LocalDate today) {
            return new DateRange(today.withDayOfMonth(1), today);
        }
    },
    PREVIOUS_MONTH("previous-month") {
        @Override
        public DateRange range(LocalDate today) {
            YearMonth prev = YearMonth.from(today).minusMonths(1);
            return new DateRange(prev.atDay(1), prev.atEndOfMonth());
        }
    },
    YEAR_TO_DATE("year-to-date") {
        @Override
        public DateRange range(LocalDate today) {
            return new DateRange(today.withDayOfYear(1), today);
        }
    },
    PREVIOUS_YEAR("previous-year") {
        @Override
        public DateRange range(LocalDate today) {
            Year prev = Year.from(today).minusYears(1);
            return new DateRange(prev.atDay(1), prev.atMonth(12).atEndOfMonth());
        }
    };

    private final String slug;

    ReportPeriod(String slug) {
        this.slug = slug;
    }

    public abstract DateRange range(LocalDate today);

    public static Optional<ReportPeriod> fromSlug(String slug) {
        return Arrays.stream(values())
                .filter(p -> p.slug.equalsIgnoreCase(slug))
                .findFirst();
    }
}