package com.billstream.billstream.security;

import com.billstream.billstream.models.ApiKey;
import com.billstream.billstream.service.ApiKeyService;
import com.billstream.billstream.service.RateLimitingService;
import com.billstream.billstream.service.UsageRecordService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

@Component
public class ApiKeyFilter extends OncePerRequestFilter {

    @Autowired
    private ApiKeyService apiKeyService;

    @Autowired
    private UsageRecordService usageRecordService;

    @Autowired
    private RateLimitingService rateLimitingService; // Injecting Redis Token Bucket layer

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Look for the X-API-KEY header in the incoming HTTP request
        String requestApiKey = request.getHeader("X-API-KEY");

        if (requestApiKey != null) {
            // 2. Validate the key against the database via our service
            Optional<ApiKey> validKeyOpt = apiKeyService.validateApiKey(requestApiKey);

            if (validKeyOpt.isPresent()) {
                ApiKey apiKeyEntity = validKeyOpt.get();

                // --- PHASE 7 REDIS RATE LIMITER CHECK ---
                boolean allowed = rateLimitingService.isAllowed(requestApiKey);

                if (!allowed) {
                    // Log the rate limit violation as a 429 error row in database analytics
                    usageRecordService.recordUsage(
                            apiKeyEntity,
                            request.getRequestURI(),
                            request.getMethod(),
                            429 // Too Many Requests status code
                    );

                    // Drop the connection immediately at the firewall filter boundary
                    response.setStatus(429);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\": \"Rate Limit Exceeded. Upgrade your plan.\"}");
                    return;
                }
                // ----------------------------------------

                // Attach the associated tenant ID to the request attributes for usage tracking later
                request.setAttribute("tenant_id", apiKeyEntity.getTenant().getId());

                // Automatically log successful consumption block for analytical records (Phase 4)
                usageRecordService.recordUsage(
                        apiKeyEntity,
                        request.getRequestURI(),
                        request.getMethod(),
                        HttpServletResponse.SC_OK
                );

                // 3. Authenticate the request in Spring Security's context
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        apiKeyEntity.getTenant().getCompanyName(), // Principal name
                        null,
                        Collections.singletonList(new SimpleGrantedAuthority("ROLE_API_CLIENT"))
                );

                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                // If a key was provided but it's invalid/revoked, block it immediately
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Invalid or Deactivated API Key.");
                return;
            }
        }

        // Pass control to the next filter in the security chain
        filterChain.doFilter(request, response);
    }
}