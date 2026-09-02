package com.taskflow.modules.wiki.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.wiki.dto.CreateWikiPageRequest;
import com.taskflow.modules.wiki.dto.UpdateWikiPageRequest;
import com.taskflow.modules.wiki.dto.WikiPageDto;
import com.taskflow.modules.wiki.dto.WikiPageTreeNodeDto;
import com.taskflow.modules.wiki.dto.WikiPageVersionDto;
import com.taskflow.modules.wiki.service.WikiService;
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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@Tag(name = "Wiki & Documentation", description = "Endpoints for managing workspace knowledge base pages, nested hierarchy, and version history")
public class WikiController {

    private final WikiService wikiService;

    public WikiController(WikiService wikiService) {
        this.wikiService = wikiService;
    }

    @PostMapping("/workspaces/{workspaceId}/wiki/pages")
    @Operation(summary = "Create a new wiki page in a workspace")
    public ResponseEntity<ApiResponse<WikiPageDto>> createPage(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID workspaceId,
            @Valid @RequestBody CreateWikiPageRequest request) {
        WikiPageDto page = wikiService.createPage(principal.getId(), workspaceId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Wiki page created successfully", page));
    }

    @GetMapping("/workspaces/{workspaceId}/wiki/tree")
    @Operation(summary = "Get workspace nested wiki tree hierarchy")
    public ResponseEntity<ApiResponse<List<WikiPageTreeNodeDto>>> getWorkspaceWikiTree(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID workspaceId) {
        List<WikiPageTreeNodeDto> tree = wikiService.getWorkspaceWikiTree(principal.getId(), workspaceId);
        return ResponseEntity.ok(ApiResponse.success("Workspace wiki tree retrieved successfully", tree));
    }

    @GetMapping("/wiki/pages/{pageId}")
    @Operation(summary = "Get details of a specific wiki page")
    public ResponseEntity<ApiResponse<WikiPageDto>> getPageDetails(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID pageId) {
        WikiPageDto page = wikiService.getPageDetails(principal.getId(), pageId);
        return ResponseEntity.ok(ApiResponse.success("Wiki page details retrieved successfully", page));
    }

    @PutMapping("/wiki/pages/{pageId}")
    @Operation(summary = "Update content or title of a wiki page (creates version snapshot)")
    public ResponseEntity<ApiResponse<WikiPageDto>> updatePage(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID pageId,
            @Valid @RequestBody UpdateWikiPageRequest request) {
        WikiPageDto updated = wikiService.updatePage(principal.getId(), pageId, request);
        return ResponseEntity.ok(ApiResponse.success("Wiki page updated successfully", updated));
    }

    @DeleteMapping("/wiki/pages/{pageId}")
    @Operation(summary = "Delete a wiki page")
    public ResponseEntity<ApiResponse<Void>> deletePage(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID pageId) {
        wikiService.deletePage(principal.getId(), pageId);
        return ResponseEntity.ok(ApiResponse.success("Wiki page deleted successfully", null));
    }

    @GetMapping("/wiki/pages/{pageId}/versions")
    @Operation(summary = "Get version history list for a wiki page")
    public ResponseEntity<ApiResponse<List<WikiPageVersionDto>>> getPageVersions(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID pageId) {
        List<WikiPageVersionDto> versions = wikiService.getPageVersions(principal.getId(), pageId);
        return ResponseEntity.ok(ApiResponse.success("Wiki page versions retrieved successfully", versions));
    }

    @GetMapping("/wiki/pages/{pageId}/versions/{version}")
    @Operation(summary = "Get specific historical version snapshot for a wiki page")
    public ResponseEntity<ApiResponse<WikiPageVersionDto>> getPageVersionDetails(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID pageId,
            @PathVariable Integer version) {
        WikiPageVersionDto versionDto = wikiService.getPageVersionDetails(principal.getId(), pageId, version);
        return ResponseEntity.ok(ApiResponse.success("Wiki page version details retrieved successfully", versionDto));
    }
}
