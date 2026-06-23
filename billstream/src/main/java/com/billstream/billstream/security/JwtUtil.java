package com.billstream.billstream.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtUtil {

    // A secure, randomly generated 256-bit signing key for HMAC-SHA
    private final Key secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // Token valid duration: 10 Hours (in milliseconds)
    private final long tokenValidity = 1000 * 60 * 60 * 10;

    // Extract username from token
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // Extract tenant ID from token claims
    public Long extractTenantId(String token) {
        final Claims claims = extractAllClaims(token);
        return claims.get("tenantId", Long.class);
    }

    // Extract token expiration date
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Generate token containing user information and multi-tenant ID
    public String generateToken(String username, Long tenantId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("tenantId", tenantId); // Crucial for multi-tenancy validation
        return createToken(claims, username);
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + tokenValidity))
                .signWith(secretKey, SignatureAlgorithm.HS256)
                .compact();
    }

    // Validate if token matches user context and isn't expired
    public Boolean validateToken(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }
}