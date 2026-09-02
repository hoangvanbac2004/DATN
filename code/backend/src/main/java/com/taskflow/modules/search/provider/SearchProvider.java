package com.taskflow.modules.search.provider;

import com.taskflow.modules.search.dto.GlobalSearchResultDto;
import com.taskflow.modules.search.dto.SearchQueryParams;

import java.util.UUID;

public interface SearchProvider {

    GlobalSearchResultDto search(UUID userId, SearchQueryParams params);
}
