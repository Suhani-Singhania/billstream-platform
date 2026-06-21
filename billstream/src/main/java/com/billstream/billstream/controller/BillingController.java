package com.billstream.billstream.controller;

import com.billstream.billstream.models.Invoice;
import com.billstream.billstream.models.User;
import com.billstream.billstream.repositories.UserRepository;
import com.billstream.billstream.service.UsageRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    @Autowired
    private UsageRecordService usageRecordService;

    @Autowired
    private UserRepository userRepository;

    // 1. Fetch all historical invoices securely bounded by Tenant Isolation
    @GetMapping("/invoices")
    public ResponseEntity<List<Invoice>> getInvoices() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user context missing"));

        Long tenantId = currentUser.getTenant().getId();
        List<Invoice> history = usageRecordService.getBillingHistory(tenantId);

        return ResponseEntity.ok(history);
    }

    // 2. On-demand endpoint to close out a cycle and compute the current amount due
    @PostMapping("/invoices/generate")
    public ResponseEntity<Invoice> triggerInvoiceGeneration() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user context missing"));

        Long tenantId = currentUser.getTenant().getId();
        Invoice generatedInvoice = usageRecordService.generateMonthlyInvoice(tenantId);

        return ResponseEntity.ok(generatedInvoice);
    }
}