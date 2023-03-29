package com.seshutechie.finociate.controller;

import com.seshutechie.finociate.model.ReportData;
import com.seshutechie.finociate.model.ReportDef;
import com.seshutechie.finociate.model.ReportDefList;
import com.seshutechie.finociate.service.ReportService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin("http://localhost:4200")
@RestController
public class ReportController {
    private static final Logger logger = LoggerFactory.getLogger(ReportController.class);

    @Autowired
    private ReportService reportService;

    @Autowired
    private ControllerUtil controllerUtil;

    @GetMapping("/report-def/{id}")
    public ReportDef getReportDef(@PathVariable String id) {
        return reportService.getReportDef(id);
    }

    @PostMapping("/report-def")
    public ReportDef createReportDef(@RequestBody ReportDef reportDef) {
        return reportService.saveReportDef(reportDef);
    }

    @PutMapping("/report-def")
    public ReportDef updateReportDef(@RequestBody ReportDef reportDef) {
        return reportService.updateReportDef(reportDef);
    }

    @DeleteMapping("/report-def/{id}")
    public ReportDef deleteReportDef(@PathVariable String id) {
        return reportService.deleteReportDef(id);
    }

    @GetMapping("/report-def/all")
    public ReportDefList getAllReportDefs() {
        List<ReportDef> reportDefs = reportService.getAllReportDefs();
        if (reportDefs != null) {
            logger.info("Report definitions found: {}", reportDefs.size());
        } else {
            logger.warn("No Report definitions found");
        }
        return new ReportDefList(reportDefs);
    }

    @GetMapping("/report/{id}")
    public ReportData getReportData(@PathVariable String id,
                                    @RequestParam Optional<String> fromDate, @RequestParam Optional<String> toDate) {
        return reportService.getReportData(id, controllerUtil.getFilterOptions(fromDate, toDate));
    }
}
