package com.taskflow.modules.wiki.service;

import com.taskflow.modules.wiki.dto.CreateWikiPageRequest;
import com.taskflow.modules.wiki.dto.UpdateWikiPageRequest;
import com.taskflow.modules.wiki.dto.WikiPageDto;
import com.taskflow.modules.wiki.dto.WikiPageTreeNodeDto;
import com.taskflow.modules.wiki.dto.WikiPageVersionDto;

import java.util.List;
import java.util.UUID;

public interface WikiService {

    WikiPageDto createPage(UUID userId, UUID workspaceId, CreateWikiPageRequest request);

    WikiPageDto getPageDetails(UUID userId, UUID pageId);

    List<WikiPageTreeNodeDto> getWorkspaceWikiTree(UUID userId, UUID workspaceId);

    WikiPageDto updatePage(UUID userId, UUID pageId, UpdateWikiPageRequest request);

    void deletePage(UUID userId, UUID pageId);

    List<WikiPageVersionDto> getPageVersions(UUID userId, UUID pageId);

    WikiPageVersionDto getPageVersionDetails(UUID userId, UUID pageId, Integer version);
}
