package com.billstream.billstream.service;

import com.billstream.billstream.models.ApiKey;
import com.billstream.billstream.models.Invoice;
import com.billstream.billstream.models.UsageRecord;
import com.billstream.billstream.repositories.ApiKeyRepository;
import com.billstream.billstream.repositories.InvoiceRepository;
import com.billstream.billstream.repositories.UsageRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class UsageRecordService {

    @Autowired
    private UsageRecordRepository usageRecordRepository;

    @Autowired
    private ApiKeyRepository apiKeyRepository;

    @Autowired
    private InvoiceRepository invoiceRepository; // Injecting our Phase 8 persistence layer

    // 1. Core Engine: Log every incoming third-party API request for billing computation
    public void recordUsage(ApiKey apiKey, String endpoint, String method, int statusCode) {
        UsageRecord record = new UsageRecord(
                apiKey.getTenant(),
                apiKey,
                endpoint,
                method,
                statusCode
        );
        usageRecordRepository.save(record);
    }

    // 2. Aggregate Data: Fetch metrics for a specific tenant's dashboard with absolute isolation
    public Map<String, Object> getDashboardMetrics(Long tenantId) {
        long totalRequests = usageRecordRepository.countTotalRequestsByTenantId(tenantId);
        long activeKeysCount = apiKeyRepository.findByTenantIdAndActiveTrue(tenantId).size();

        // Dynamic Tier-Based Metering Calculation (Phase 8 Strategy Preview)
        // Basic tier formula: First 1000 free, then $0.001 per request
        double monthlyBill = 0.0;
        if (totalRequests > 1000) {
            monthlyBill = (totalRequests - 1000) * 0.001;
        }

        // Calculate quota percentage used (Assuming a soft limit standard threshold of 10,000 requests)
        long quotaLimit = 10000;
        double quotaUsedPercentage = ((double) totalRequests / quotaLimit) * 100;
        if (quotaUsedPercentage > 100) quotaUsedPercentage = 100.0;

        Map<String, Object> metrics = new HashMap<>();
        metrics.put("activeApiKeys", activeKeysCount);
        metrics.put("totalRequests", totalRequests);
        metrics.put("monthlyBill", Math.round(monthlyBill * 100.0) / 100.0); // Round neatly to 2 decimal places
        metrics.put("quotaUsed", Math.round(quotaUsedPercentage));

        return metrics;
    }

    // 3. Phase 5 Analytics: Generates structured trend charts for the frontend graphs
    public Map<String, Object> getTenantAnalytics(Long tenantId) {
        Map<String, Object> analyticsData = new HashMap<>();

        // 1. Process Endpoint Distribution Breakdown
        List<Object[]> endpointData = usageRecordRepository.countRequestsByEndpoint(tenantId);
        Map<String, Long> endpoints = new HashMap<>();
        for (Object[] row : endpointData) {
            endpoints.put((String) row[0], (Long) row[1]);
        }
        analyticsData.put("topEndpoints", endpoints);

        // 2. Process Success (2xx) vs Failure (4xx/5xx) Distribution
        List<Object[]> statusData = usageRecordRepository.countRequestsByStatusCode(tenantId);
        long successCount = 0;
        long failureCount = 0;
        for (Object[] row : statusData) {
            int statusCode = (int) row[0];
            long count = (Long) row[1];
            if (statusCode >= 200 && statusCode < 300) {
                successCount += count;
            } else {
                failureCount += count;
            }
        }
        analyticsData.put("successRequests", successCount);
        analyticsData.put("failureRequests", failureCount);

        // 3. Process Daily Time-Series Timeline Data
        List<Object[]> dailyData = usageRecordRepository.countRequestsByDay(tenantId);
        List<Map<String, Object>> timeline = new ArrayList<>();
        for (Object[] row : dailyData) {
            Map<String, Object> dayMap = new HashMap<>();
            dayMap.put("date", row[0].toString());
            dayMap.put("count", row[1]);
            timeline.add(dayMap);
        }
        analyticsData.put("timeline", timeline);

        return analyticsData;
    }

    // 4. Phase 8 Billing Engine: Dynamically computes usage amounts and saves historical records
    public Invoice generateMonthlyInvoice(Long tenantId) {
        long totalRequests = usageRecordRepository.countTotalRequestsByTenantId(tenantId);

        // Tier Pricing Strategy: Free first 1000 records, then $0.001 per overage unit
        double amountDue = 0.0;
        if (totalRequests > 1000) {
            amountDue = (totalRequests - 1000) * 0.001;
        }

        // Format to two precise decimal positions
        amountDue = Math.round(amountDue * 100.0) / 100.0;

        // Fetch context verification from an active assigned key block
        ApiKey keyContext = apiKeyRepository.findByTenantIdAndActiveTrue(tenantId)
                .stream().findFirst()
                .orElseThrow(() -> new RuntimeException("No active tenant configuration context found"));

        Invoice invoice = new Invoice(keyContext.getTenant(), totalRequests, amountDue);
        return invoiceRepository.save(invoice);
    }

    // 5. Secure Context Filtering: Fetches structural invoices bounded strictly by tenant isolation bounds
    public List<Invoice> getBillingHistory(Long tenantId) {
        return invoiceRepository.findByTenantIdOrderByGeneratedAtDesc(tenantId);
    }
}