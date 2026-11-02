package com.alekseibykau.report;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@AllArgsConstructor
@RequestMapping("/reports")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/{period}")
    public ReportResponse reportByPeriod(@PathVariable String period) {
        ReportPeriod reportPeriod = ReportPeriod.fromSlug(period)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Unknown report title: " + period));
        return reportService.generateByPeriod(reportPeriod);
    }

    @GetMapping
    public ReportResponse reportByVendor(@RequestParam String vendor) {
        return reportService.generateByVendor(vendor);
    }
}
