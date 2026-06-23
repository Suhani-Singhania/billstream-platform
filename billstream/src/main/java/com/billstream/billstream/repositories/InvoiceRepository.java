package com.billstream.billstream.repositories;

import com.billstream.billstream.models.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    // Phase 6 Isolation: Fetch historical billing entries bounded strictly to the logged-in tenant
    List<Invoice> findByTenantIdOrderByGeneratedAtDesc(Long tenantId);
}