package com.billstream.billstream.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class RateLimitingService {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    // Standard plan configuration profiles (Requests Per Minute)
    private static final long BUCKET_CAPACITY = 100; // Total maximum bucket space
    private static final long REFILL_RATE_PER_MIN = 100;
    private static final long REFILL_INTERVAL_SEC = 60;

    /**
     * Core Algorithm Evaluation: Verifies if a specific API key has sufficient token balance remaining.
     * Returns true if request is allowed, false if rate limit is exceeded.
     */
    public boolean isAllowed(String apiKey) {
        String redisKey = "ratelimit:" + apiKey;
        long now = System.currentTimeMillis() / 1000; // Current time in seconds

        // Fetch current bucket metrics from Redis cache map fields
        Map<Object, Object> bucket = redisTemplate.opsForHash().entries(redisKey);

        long tokens;
        long lastRefillTime;

        if (bucket.isEmpty()) {
            // First request scenario: Initialize bucket to maximum capacities
            tokens = BUCKET_CAPACITY;
            lastRefillTime = now;
        } else {
            tokens = Long.parseLong((String) bucket.get("tokens"));
            lastRefillTime = Long.parseLong((String) bucket.get("lastRefillTime"));

            // Calculate how many tokens need to be added based on elapsed timeframe cycles
            long elapsedTime = now - lastRefillTime;
            long tokensToAdd = (elapsedTime * REFILL_RATE_PER_MIN) / REFILL_INTERVAL_SEC;

            if (tokensToAdd > 0) {
                tokens = Math.min(BUCKET_CAPACITY, tokens + tokensToAdd);
                lastRefillTime = now;
            }
        }

        // Evaluate request compliance bounds
        if (tokens >= 1) {
            tokens--; // Consume 1 token for this transaction line item

            // Save updated state metrics back to memory cluster layer
            Map<String, String> newBucketData = new HashMap<>();
            newBucketData.put("tokens", String.valueOf(tokens));
            newBucketData.put("lastRefillTime", String.valueOf(lastRefillTime));

            redisTemplate.opsForHash().putAll(redisKey, newBucketData);
            return true; // Request approved
        }

        return false; // Rate limit exceeded! Block traffic immediately
    }
}