package com.taskflow.modules.search.service.impl;

import com.taskflow.common.AppException;
import com.taskflow.common.ResultCode;
import com.taskflow.modules.search.dto.CreateSavedFilterRequest;
import com.taskflow.modules.search.dto.GlobalSearchResultDto;
import com.taskflow.modules.search.dto.SavedSearchFilterDto;
import com.taskflow.modules.search.dto.SearchHistoryDto;
import com.taskflow.modules.search.dto.SearchQueryParams;
import com.taskflow.modules.search.entity.SavedSearchFilterEntity;
import com.taskflow.modules.search.entity.SearchHistoryEntity;
import com.taskflow.modules.search.provider.SearchProvider;
import com.taskflow.modules.search.repository.SavedSearchFilterRepository;
import com.taskflow.modules.search.repository.SearchHistoryRepository;
import com.taskflow.modules.search.service.SearchService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SearchServiceImpl implements SearchService {

    private final SearchProvider searchProvider;
    private final SavedSearchFilterRepository savedFilterRepository;
    private final SearchHistoryRepository searchHistoryRepository;

    public SearchServiceImpl(
            SearchProvider searchProvider,
            SavedSearchFilterRepository savedFilterRepository,
            SearchHistoryRepository searchHistoryRepository) {
        this.searchProvider = searchProvider;
        this.savedFilterRepository = savedFilterRepository;
        this.searchHistoryRepository = searchHistoryRepository;
    }

    @Override
    @Transactional
    public GlobalSearchResultDto globalSearch(UUID userId, SearchQueryParams params) {
        if (params.getQuery() != null && !params.getQuery().trim().isEmpty()) {
            searchHistoryRepository.save(new SearchHistoryEntity(userId, params.getQuery().trim(), "GLOBAL"));
        }
        return searchProvider.search(userId, params);
    }

    @Override
    @Transactional
    public SavedSearchFilterDto createSavedFilter(UUID userId, CreateSavedFilterRequest request) {
        SavedSearchFilterEntity entity = new SavedSearchFilterEntity(
                userId,
                request.getWorkspaceId(),
                request.getName().trim(),
                request.getQuery(),
                request.getFilterConfigJson(),
                request.getIsPinned()
        );
        SavedSearchFilterEntity saved = savedFilterRepository.save(entity);
        return toSavedFilterDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SavedSearchFilterDto> getUserSavedFilters(UUID userId, UUID workspaceId) {
        List<SavedSearchFilterEntity> filters = workspaceId != null
                ? savedFilterRepository.findByUserIdAndWorkspaceIdOrderByIsPinnedDescCreatedAtDesc(userId, workspaceId)
                : savedFilterRepository.findByUserIdOrderByIsPinnedDescCreatedAtDesc(userId);
        return filters.stream().map(this::toSavedFilterDto).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteSavedFilter(UUID userId, UUID filterId) {
        SavedSearchFilterEntity filter = savedFilterRepository.findById(filterId)
                .orElseThrow(() -> new AppException(ResultCode.NOT_FOUND, "Saved search filter not found"));
        if (!filter.getUserId().equals(userId)) {
            throw new AppException(ResultCode.FORBIDDEN, "Access denied to saved filter");
        }
        savedFilterRepository.delete(filter);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SearchHistoryDto> getUserSearchHistory(UUID userId) {
        List<SearchHistoryEntity> histories = searchHistoryRepository.findTop10ByUserIdOrderByCreatedAtDesc(userId);
        return histories.stream()
                .map(h -> new SearchHistoryDto(h.getId(), h.getUserId(), h.getQuery(), h.getEntityType(), h.getCreatedAt()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void clearUserSearchHistory(UUID userId) {
        searchHistoryRepository.deleteByUserId(userId);
    }

    private SavedSearchFilterDto toSavedFilterDto(SavedSearchFilterEntity entity) {
        return new SavedSearchFilterDto(
                entity.getId(),
                entity.getUserId(),
                entity.getWorkspaceId(),
                entity.getName(),
                entity.getQuery(),
                entity.getFilterConfigJson(),
                entity.getIsPinned(),
                entity.getCreatedAt()
        );
    }
}
