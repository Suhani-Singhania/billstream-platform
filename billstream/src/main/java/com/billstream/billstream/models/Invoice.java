package com.billstream.billstream.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "invoices")
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @Column(name = "total_requests", nullable = false)
    private long totalRequests;

    @Column(name = "amount_due", nullable = false)
    private double amountDue;

    @Column(nullable = false)
    private String status = "PENDING"; // PENDING, PAID, OVERDUE

    @Column(name = "generated_at", nullable = false)
    private LocalDateTime generatedAt = LocalDateTime.now();

    // Constructors
    public Invoice() {}

    public Invoice(Tenant tenant, long totalRequests, double amountDue) {
        this.tenant = tenant;
        this.totalRequests = totalRequests;
        this.amountDue = amountDue;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public Tenant getTenant() { return tenant; }
    public long getTotalRequests() { return totalRequests; }
    public double getAmountDue() { return amountDue; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}