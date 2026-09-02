package com.taskflow.modules.search.provider.impl;

import com.taskflow.modules.search.dto.GlobalSearchResultDto;
import com.taskflow.modules.search.dto.SearchQueryParams;
import com.taskflow.modules.search.provider.SearchProvider;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
public class ElasticsearchSearchProviderImpl implements SearchProvider {

    @Override
    public GlobalSearchResultDto search(UUID userId, SearchQueryParams params) {
        // Architecture stub for future Elasticsearch cluster integration
        return new GlobalSearchResultDto(
                List.of(),
                0,
                0,
                0,
                0,
                0,
                0,
                20,
                0,
                true
        );
    }
}
