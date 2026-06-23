package com.billstream.billstream.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final ApiKeyFilter apiKeyFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, ApiKeyFilter apiKeyFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.apiKeyFilter = apiKeyFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Enable CORS using our dynamic implementation below
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Disable CSRF since stateless tokens handle session security
                .csrf(csrf -> csrf.disable())

                // Route security rules
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll() // Open auth routes
                        .anyRequest().authenticated()               // Everything else requires valid auth
                )

                // Enforce Stateless API session strategy
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );

        // Check for API key presence first
        http.addFilterBefore(apiKeyFilter, UsernamePasswordAuthenticationFilter.class);

        // Chain JWT verification right after the API key block
        http.addFilterAfter(jwtAuthenticationFilter, ApiKeyFilter.class);

        return http.build();
    }

    // 2. Inline CORS setup bypassing stuck IntelliJ imports completely
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "X-API-KEY"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);

        return new CorsConfigurationSource() {
            @Override
            public CorsConfiguration getCorsConfiguration(jakarta.servlet.http.HttpServletRequest request) {
                return configuration;
            }
        };
    }
}