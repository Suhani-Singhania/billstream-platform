package com.billstream.billstream.service;

import com.billstream.billstream.models.ApiKey;
import com.billstream.billstream.repositories.ApiKeyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Base64;
import java.util.Optional;

@Service
public class ApiKeyService {

    @Autowired
    private ApiKeyRepository apiKeyRepository;

    private static final SecureRandom secureRandom = new SecureRandom();
    private static final Base64.Encoder base64Encoder = Base64.getUrlEncoder().withoutPadding();

    public String generateApiKeyString() {
        byte[] randomBytes = new byte[24];
        secureRandom.nextBytes(randomBytes);
        return "bs_" + base64Encoder.encodeToString(randomBytes);
    }

    public Optional<ApiKey> validateApiKey(String apiKeyString) {
        return apiKeyRepository.findByApiKey(apiKeyString)
                .filter(ApiKey::isActive);
    }
}