package com.billstream.billstream.models;

import jakarta.persistence.*;

@Entity
@Table(name = "pricing_plans")
public class PricingPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name; // e.g., "FREE", "PRO", "ENTERPRISE"

    @Column(name = "base_price", nullable = false)
    private double basePrice; // Flat monthly rate

    @Column(name = "included_requests", nullable = false)
    private long includedRequests; // Free allowance size

    @Column(name = "overage_rate", nullable = false)
    private double overageRate; // Cost per request after allowance

    // Constructors
    public PricingPlan() {}

    public PricingPlan(String name, double basePrice, long includedRequests, double overageRate) {
        this.name = name;
        this.basePrice = basePrice;
        this.includedRequests = includedRequests;
        this.overageRate = overageRate;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public String getName() { return name; }
    public double getBasePrice() { return basePrice; }
    public long getIncludedRequests() { return includedRequests; }
    public double getOverageRate() { return overageRate; }
}