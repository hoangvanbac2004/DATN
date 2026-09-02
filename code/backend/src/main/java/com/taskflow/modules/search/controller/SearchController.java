package com.taskflow.modules.search.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.search.dto.CreateSavedFilterRequest;
import com.taskflow.modules.search.dto.GlobalSearchResultDto;
import com.taskflow.modules.search.dto.SavedSearchFilterDto;
import com.taskflow.modules.search.dto.SearchHistoryDto;
import com.taskflow.modules.search.dto.SearchQueryParams;
import com.taskflow.modules.search.service.SearchService;
import com.taskflow.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/search")
@Tag(name = "Global & Advanced Search", description = "Endpoints for unified search, saved search filters, and query search history")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping
    @Operation(summary = "Perform global and advanced search")
    public ResponseEntity<ApiResponse<GlobalSearchResultDto>> globalSearch(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false, defaultValue = "") String q,
            @RequestParam(required = false, defaultValue = "ALL") String type,
            @RequestParam(required = false) UUID workspaceId,
            @RequestParam(required = false) UUID projectId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false, defaultValue = "relevance") String sortBy,
            @RequestParam(required = false, defaultValue = "desc") String sortOrder,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "20") int size) {

        SearchQueryParams params = new SearchQueryParams(
                q, type, workspaceId, projectId, status, priority, sortBy, sortOrder, page, size
        );

        GlobalSearchResultDto result = searchService.globalSearch(principal.getId(), params);
        return ResponseEntity.ok(ApiResponse.success("Search completed successfully", result));
    }

    @PostMapping("/saved-filters")
    @Operation(summary = "Create a saved search filter preset")
    public ResponseEntity<ApiResponse<SavedSearchFilterDto>> createSavedFilter(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateSavedFilterRequest request) {
        SavedSearchFilterDto saved = searchService.createSavedFilter(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Saved filter created successfully", saved));
    }

    @GetMapping("/saved-filters")
    @Operation(summary = "Get user saved search filter presets")
    public ResponseEntity<ApiResponse<List<SavedSearchFilterDto>>> getUserSavedFilters(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) UUID workspaceId) {
        List<SavedSearchFilterDto> filters = searchService.getUserSavedFilters(principal.getId(), workspaceId);
        return ResponseEntity.ok(ApiResponse.success("Saved search filters retrieved successfully", filters));
    }

    @DeleteMapping("/saved-filters/{filterId}")
    @Operation(summary = "Delete a saved search filter preset")
    public ResponseEntity<ApiResponse<Void>> deleteSavedFilter(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID filterId) {
        searchService.deleteSavedFilter(principal.getId(), filterId);
        return ResponseEntity.ok(ApiResponse.success("Saved filter deleted successfully", null));
    }

    @GetMapping("/history")
    @Operation(summary = "Get user recent search query history")
    public ResponseEntity<ApiResponse<List<SearchHistoryDto>>> getUserSearchHistory(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<SearchHistoryDto> history = searchService.getUserSearchHistory(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Search history retrieved successfully", history));
    }

    @DeleteMapping("/history")
    @Operation(summary = "Clear user search history")
    public ResponseEntity<ApiResponse<Void>> clearUserSearchHistory(
            @AuthenticationPrincipal UserPrincipal principal) {
        searchService.clearUserSearchHistory(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Search history cleared successfully", null));
    }
}
