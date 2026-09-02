package com.taskflow.modules.wiki.mapper;

import com.taskflow.modules.wiki.dto.WikiPageDto;
import com.taskflow.modules.wiki.dto.WikiPageTreeNodeDto;
import com.taskflow.modules.wiki.dto.WikiPageVersionDto;
import com.taskflow.modules.wiki.entity.WikiPageEntity;
import com.taskflow.modules.wiki.entity.WikiPageVersionEntity;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Component
public class WikiMapper {

    public WikiPageDto toDto(WikiPageEntity entity) {
        if (entity == null) return null;
        return new WikiPageDto(
                entity.getId(),
                entity.getWorkspaceId(),
                entity.getProjectId(),
                entity.getParentPageId(),
                entity.getTitle(),
                entity.getSlug(),
                entity.getContent(),
                entity.getIcon(),
                entity.getVersion(),
                entity.getIsArchived(),
                entity.getCreatedAt(),
                entity.getUpdatedAt(),
                entity.getCreatedBy()
        );
    }

    public WikiPageVersionDto toVersionDto(WikiPageVersionEntity entity) {
        if (entity == null) return null;
        return new WikiPageVersionDto(
                entity.getId(),
                entity.getPageId(),
                entity.getVersion(),
                entity.getTitle(),
                entity.getContent(),
                entity.getChangeSummary(),
                entity.getCreatedAt(),
                entity.getCreatedBy()
        );
    }

    public List<WikiPageTreeNodeDto> buildTree(List<WikiPageEntity> allPages) {
        Map<UUID, WikiPageTreeNodeDto> dtoMap = allPages.stream().collect(Collectors.toMap(
                WikiPageEntity::getId,
                page -> new WikiPageTreeNodeDto(page.getId(), page.getParentPageId(), page.getTitle(), page.getSlug(), page.getIcon())
        ));

        List<WikiPageTreeNodeDto> rootNodes = new ArrayList<>();
        for (WikiPageEntity page : allPages) {
            WikiPageTreeNodeDto node = dtoMap.get(page.getId());
            if (page.getParentPageId() != null && dtoMap.containsKey(page.getParentPageId())) {
                dtoMap.get(page.getParentPageId()).getChildren().add(node);
            } else {
                rootNodes.add(node);
            }
        }
        return rootNodes;
    }
}
