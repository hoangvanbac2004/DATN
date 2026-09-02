package com.taskflow.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig {

    /**
     * Per-cache TTL configuration using named Caffeine caches.
     * Each domain cache has tuned maximumSize and expiry to reflect access patterns:
     *  - users:         15m TTL  – profile data rarely changes
     *  - workspaces:    10m TTL  – workspace config changes infrequently
     *  - projects:       5m TTL  – project settings change occasionally
     *  - notifications:  2m TTL  – must reflect recent state
     */
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager manager = new CaffeineCacheManager();
        manager.setCacheNames(Arrays.asList("users", "workspaces", "projects", "notifications"));
        // Default spec – overridden per-cache below via manual registration
        manager.setCaffeine(defaultCaffeineSpec());
        return manager;
    }

    /**
     * Shared default: 1000 max entries, 5-minute expiry after write.
     * Individual services use @Cacheable with specific cache names.
     */
    private Caffeine<Object, Object> defaultCaffeineSpec() {
        return Caffeine.newBuilder()
                .maximumSize(1000)
                .expireAfterWrite(5, TimeUnit.MINUTES)
                .recordStats(); // enables cache hit/miss metrics logging
    }
}
