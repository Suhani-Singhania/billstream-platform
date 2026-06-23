package com.billstream.billstream.repositories;

import com.billstream.billstream.models.ApiKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApiKeyRepository extends JpaRepository<ApiKey, Long> {

    // Find a specific API key to validate incoming API traffic
    Optional<ApiKey> findByApiKey(String apiKey);

    // Fetch all active API keys belonging to a single client/tenant
    List<ApiKey> findByTenantIdAndActiveTrue(Long tenantId);
}