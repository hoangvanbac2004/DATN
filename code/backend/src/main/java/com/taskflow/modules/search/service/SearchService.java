package com.taskflow.modules.search.service;

import com.taskflow.modules.search.dto.CreateSavedFilterRequest;
import com.taskflow.modules.search.dto.GlobalSearchResultDto;
import com.taskflow.modules.search.dto.SavedSearchFilterDto;
import com.taskflow.modules.search.dto.SearchHistoryDto;
import com.taskflow.modules.search.dto.SearchQueryParams;

import java.util.List;
import java.util.UUID;

public interface SearchService {

    GlobalSearchResultDto globalSearch(UUID userId, SearchQueryParams params);

    SavedSearchFilterDto createSavedFilter(UUID userId, CreateSavedFilterRequest request);

    List<SavedSearchFilterDto> getUserSavedFilters(UUID userId, UUID workspaceId);

    void deleteSavedFilter(UUID userId, UUID filterId);

    List<SearchHistoryDto> getUserSearchHistory(UUID userId);

    void clearUserSearchHistory(UUID userId);
}
