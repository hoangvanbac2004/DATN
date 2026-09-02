package com.taskflow.modules.wiki.service.impl;

import com.taskflow.common.AppException;
import com.taskflow.common.ResultCode;
import com.taskflow.modules.workspace.service.WorkspaceService;
import com.taskflow.modules.wiki.dto.CreateWikiPageRequest;
import com.taskflow.modules.wiki.dto.UpdateWikiPageRequest;
import com.taskflow.modules.wiki.dto.WikiPageDto;
import com.taskflow.modules.wiki.dto.WikiPageTreeNodeDto;
import com.taskflow.modules.wiki.dto.WikiPageVersionDto;
import com.taskflow.modules.wiki.entity.WikiPageEntity;
import com.taskflow.modules.wiki.entity.WikiPageVersionEntity;
import com.taskflow.modules.wiki.mapper.WikiMapper;
import com.taskflow.modules.wiki.repository.WikiPageRepository;
import com.taskflow.modules.wiki.repository.WikiPageVersionRepository;
import com.taskflow.modules.wiki.service.WikiService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class WikiServiceImpl implements WikiService {

    private final WikiPageRepository pageRepository;
    private final WikiPageVersionRepository versionRepository;
    private final WorkspaceService workspaceService;
    private final WikiMapper wikiMapper;

    public WikiServiceImpl(
            WikiPageRepository pageRepository,
            WikiPageVersionRepository versionRepository,
            WorkspaceService workspaceService,
            WikiMapper wikiMapper) {
        this.pageRepository = pageRepository;
        this.versionRepository = versionRepository;
        this.workspaceService = workspaceService;
        this.wikiMapper = wikiMapper;
    }

    @Override
    @Transactional
    public WikiPageDto createPage(UUID userId, UUID workspaceId, CreateWikiPageRequest request) {
        workspaceService.getWorkspaceDetails(userId, workspaceId);

        String slug = generateSlug(request.getTitle());

        WikiPageEntity page = new WikiPageEntity(
                workspaceId,
                request.getProjectId(),
                request.getParentPageId(),
                request.getTitle().trim(),
                slug,
                request.getContent(),
                request.getIcon()
        );

        WikiPageEntity saved = pageRepository.save(page);

        // Initial version snapshot
        WikiPageVersionEntity initialVersion = new WikiPageVersionEntity(
                saved.getId(),
                saved.getVersion(),
                saved.getTitle(),
                saved.getContent(),
                "Initial creation",
                userId
        );
        versionRepository.save(initialVersion);

        return wikiMapper.toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public WikiPageDto getPageDetails(UUID userId, UUID pageId) {
        WikiPageEntity page = findActivePageById(pageId);
        workspaceService.getWorkspaceDetails(userId, page.getWorkspaceId());
        return wikiMapper.toDto(page);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WikiPageTreeNodeDto> getWorkspaceWikiTree(UUID userId, UUID workspaceId) {
        workspaceService.getWorkspaceDetails(userId, workspaceId);
        List<WikiPageEntity> pages = pageRepository.findByWorkspaceIdAndIsDeletedFalse(workspaceId);
        return wikiMapper.buildTree(pages);
    }

    @Override
    @Transactional
    public WikiPageDto updatePage(UUID userId, UUID pageId, UpdateWikiPageRequest request) {
        WikiPageEntity page = findActivePageById(pageId);
        workspaceService.getWorkspaceDetails(userId, page.getWorkspaceId());

        page.setTitle(request.getTitle().trim());
        if (request.getContent() != null) {
            page.setContent(request.getContent());
        }
        if (request.getIcon() != null) {
            page.setIcon(request.getIcon());
        }
        page.setVersion(page.getVersion() + 1);

        WikiPageEntity updated = pageRepository.save(page);

        // Create version history snapshot
        WikiPageVersionEntity versionSnapshot = new WikiPageVersionEntity(
                updated.getId(),
                updated.getVersion(),
                updated.getTitle(),
                updated.getContent(),
                request.getChangeSummary() != null ? request.getChangeSummary() : "Page content update",
                userId
        );
        versionRepository.save(versionSnapshot);

        return wikiMapper.toDto(updated);
    }

    @Override
    @Transactional
    public void deletePage(UUID userId, UUID pageId) {
        WikiPageEntity page = findActivePageById(pageId);
        workspaceService.getWorkspaceDetails(userId, page.getWorkspaceId());

        page.setIsDeleted(true);
        page.setDeletedAt(Instant.now());
        pageRepository.save(page);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WikiPageVersionDto> getPageVersions(UUID userId, UUID pageId) {
        WikiPageEntity page = findActivePageById(pageId);
        workspaceService.getWorkspaceDetails(userId, page.getWorkspaceId());

        List<WikiPageVersionEntity> versions = versionRepository.findByPageIdOrderByVersionDesc(pageId);
        return versions.stream().map(wikiMapper::toVersionDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public WikiPageVersionDto getPageVersionDetails(UUID userId, UUID pageId, Integer version) {
        WikiPageEntity page = findActivePageById(pageId);
        workspaceService.getWorkspaceDetails(userId, page.getWorkspaceId());

        WikiPageVersionEntity versionEntity = versionRepository.findByPageIdAndVersion(pageId, version)
                .orElseThrow(() -> new AppException(ResultCode.NOT_FOUND, "Wiki page version not found"));

        return wikiMapper.toVersionDto(versionEntity);
    }

    private WikiPageEntity findActivePageById(UUID pageId) {
        return pageRepository.findByIdAndIsDeletedFalse(pageId)
                .orElseThrow(() -> new AppException(ResultCode.NOT_FOUND, "Wiki page not found"));
    }

    private String generateSlug(String title) {
        String slugBase = title.toLowerCase().replaceAll("[^a-z0-9-]", "-").replaceAll("-+", "-");
        return slugBase + "-" + UUID.randomUUID().toString().substring(0, 8);
    }
}
