package com.billstream.billstream.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    // Inject our working JwtUtil bean
    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Extract the Authorization Header from the incoming HTTP request
        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String jwtToken = null;

        // 2. JWT Tokens are always transmitted as a 'Bearer <token_string>' format
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwtToken = authorizationHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwtToken);
            } catch (Exception e) {
                logger.error("Unable to extract username from JWT Token: " + e.getMessage());
            }
        }

        // 3. If a valid username is found and the user session isn't authenticated yet
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Validate the token cryptographically
            if (jwtUtil.validateToken(jwtToken, username)) {

                // Extract tenantId from the token to attach it dynamically to the context
                Long tenantId = jwtUtil.extractTenantId(jwtToken);
                request.setAttribute("tenantId", tenantId); // Crucial for Multi-Tenancy validation later!

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        username, null, new ArrayList<>()); // Passing empty list for basic authorities right now

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // Set the user context explicitly inside Spring Security context memory
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 4. Pass the request down the pipeline filter chain
        filterChain.doFilter(request, response);
    }
}