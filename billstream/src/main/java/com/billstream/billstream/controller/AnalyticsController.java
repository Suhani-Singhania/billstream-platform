package com.billstream.billstream.controller;

import com.billstream.billstream.models.User;
import com.billstream.billstream.repositories.UserRepository;
import com.billstream.billstream.service.UsageRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private UsageRecordService usageRecordService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getAnalyticsData() {
        // Strict Phase 6 isolation: Context bounded mapping via user session
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userRepository.findByUsername(auth.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated context invalid"));

        Long tenantId = currentUser.getTenant().getId();
        Map<String, Object> analytics = usageRecordService.getTenantAnalytics(tenantId);

        return ResponseEntity.ok(analytics);
    }
}