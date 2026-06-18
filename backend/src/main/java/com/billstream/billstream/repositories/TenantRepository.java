package com.billstream.billstream.repositories;

import com.billstream.billstream.models.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TenantRepository extends JpaRepository<Tenant, Long> {
    Optional<Tenant> findByApiKey(String apiKey);
}
