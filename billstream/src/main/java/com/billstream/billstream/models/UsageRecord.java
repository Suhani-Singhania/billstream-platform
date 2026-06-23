package com.billstream.billstream.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "usage_records")
public class UsageRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tenant_id", nullable = false)
    private Tenant tenant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "api_key_id", nullable = false)
    private ApiKey apiKey;

    @Column(nullable = false)
    private String endpoint;

    @Column(nullable = false)
    private String method;

    @Column(name = "status_code", nullable = false)
    private int statusCode;

    @Column(name = "request_time", nullable = false)
    private LocalDateTime requestTime = LocalDateTime.now();

    // Default Constructor
    public UsageRecord() {}

    // Convenience Constructor
    public UsageRecord(Tenant tenant, ApiKey apiKey, String endpoint, String method, int statusCode) {
        this.tenant = tenant;
        this.apiKey = apiKey;
        this.endpoint = endpoint;
        this.method = method;
        this.statusCode = statusCode;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Tenant getTenant() { return tenant; }
    public void setTenant(Tenant tenant) { this.tenant = tenant; }

    public ApiKey getApiKey() { return apiKey; }
    public void setApiKey(ApiKey apiKey) { this.apiKey = apiKey; }

    public String getEndpoint() { return endpoint; }
    public void setEndpoint(String endpoint) { this.endpoint = endpoint; }

    public String getMethod() { return method; }
    public void setMethod(String method) { this.method = method; }

    public int getStatusCode() { return statusCode; }
    public void setStatusCode(int statusCode) { this.statusCode = statusCode; }

    public LocalDateTime getRequestTime() { return requestTime; }
    public void setRequestTime(LocalDateTime requestTime) { this.requestTime = requestTime; }
}