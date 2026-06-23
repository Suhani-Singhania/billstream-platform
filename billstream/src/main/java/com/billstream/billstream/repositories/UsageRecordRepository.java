package com.billstream.billstream.repositories;

import com.billstream.billstream.models.UsageRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsageRecordRepository extends JpaRepository<UsageRecord, Long> {

    // Core database aggregation query to calculate real-time tenant stats for the dashboard
    @Query("SELECT COUNT(u) FROM UsageRecord u WHERE u.tenant.id = :tenantId")
    long countTotalRequestsByTenantId(@Param("tenantId") Long tenantId);

    // 1. Group requests by endpoint for the tenant
    @Query("SELECT u.endpoint, COUNT(u) FROM UsageRecord u WHERE u.tenant.id = :tenantId GROUP BY u.endpoint")
    List<Object[]> countRequestsByEndpoint(@Param("tenantId") Long tenantId);

    // 2. Group requests by HTTP status code (to calculate success vs failure rates)
    @Query("SELECT u.statusCode, COUNT(u) FROM UsageRecord u WHERE u.tenant.id = :tenantId GROUP BY u.statusCode")
    List<Object[]> countRequestsByStatusCode(@Param("tenantId") Long tenantId);

    // 3. Group requests by Day (Truncating timestamp to date for time-series charts)
    @Query("SELECT CAST(u.requestTime AS date), COUNT(u) FROM UsageRecord u WHERE u.tenant.id = :tenantId GROUP BY CAST(u.requestTime AS date) ORDER BY CAST(u.requestTime AS date) ASC")
    List<Object[]> countRequestsByDay(@Param("tenantId") Long tenantId);
}