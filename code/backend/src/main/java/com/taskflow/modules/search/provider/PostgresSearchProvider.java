package com.taskflow.modules.search.provider;

import com.taskflow.modules.comment.entity.CommentEntity;
import com.taskflow.modules.comment.repository.CommentRepository;
import com.taskflow.modules.project.entity.ProjectEntity;
import com.taskflow.modules.project.repository.ProjectRepository;
import com.taskflow.modules.search.dto.GlobalSearchResultDto;
import com.taskflow.modules.search.dto.SearchQueryParams;
import com.taskflow.modules.search.dto.SearchResultItemDto;
import com.taskflow.modules.tag.entity.TagEntity;
import com.taskflow.modules.tag.repository.TagRepository;
import com.taskflow.modules.task.entity.TaskEntity;
import com.taskflow.modules.task.repository.TaskRepository;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Component
@Primary
public class PostgresSearchProvider implements SearchProvider {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final TagRepository tagRepository;
    private final CommentRepository commentRepository;

    public PostgresSearchProvider(
            TaskRepository taskRepository,
            ProjectRepository projectRepository,
            TagRepository tagRepository,
            CommentRepository commentRepository) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.tagRepository = tagRepository;
        this.commentRepository = commentRepository;
    }

    @Override
    public GlobalSearchResultDto search(UUID userId, SearchQueryParams params) {
        String query = (params.getQuery() != null) ? params.getQuery().trim() : "";
        String typeFilter = (params.getType() != null) ? params.getType().trim().toUpperCase() : "ALL";

        List<SearchResultItemDto> allItems = new ArrayList<>();

        long totalTasks = 0;
        long totalProjects = 0;
        long totalTags = 0;
        long totalComments = 0;

        // 1. Search Tasks
        if ("ALL".equals(typeFilter) || "TASK".equals(typeFilter)) {
            List<TaskEntity> tasks = taskRepository.globalSearchTasks(
                    params.getProjectId(),
                    params.getStatus(),
                    params.getPriority(),
                    query.isEmpty() ? null : query
            );
            totalTasks = tasks.size();
            for (TaskEntity task : tasks) {
                allItems.add(new SearchResultItemDto(
                        task.getId(),
                        task.getTitle(),
                        task.getDescription(),
                        "TASK",
                        "/tasks?id=" + task.getId(),
                        null,
                        task.getProjectId(),
                        task.getId(),
                        task.getStatus(),
                        task.getPriority(),
                        "#4F46E5",
                        task.getCreatedAt()
                ));
            }
        }

        // 2. Search Projects
        if ("ALL".equals(typeFilter) || "PROJECT".equals(typeFilter)) {
            if (!query.isEmpty()) {
                List<ProjectEntity> projects = projectRepository.searchProjects(params.getWorkspaceId(), query);
                totalProjects = projects.size();
                for (ProjectEntity project : projects) {
                    allItems.add(new SearchResultItemDto(
                            project.getId(),
                            project.getName(),
                            project.getDescription(),
                            "PROJECT",
                            "/projects/" + project.getId(),
                            project.getWorkspaceId(),
                            project.getId(),
                            null,
                            null,
                            null,
                            project.getColor() != null ? project.getColor() : "#10B981",
                            project.getCreatedAt()
                    ));
                }
            }
        }

        // 3. Search Tags
        if ("ALL".equals(typeFilter) || "TAG".equals(typeFilter)) {
            if (!query.isEmpty() && params.getWorkspaceId() != null) {
                List<TagEntity> tags = tagRepository.searchWorkspaceTags(params.getWorkspaceId(), query);
                totalTags = tags.size();
                for (TagEntity tag : tags) {
                    allItems.add(new SearchResultItemDto(
                            tag.getId(),
                            tag.getName(),
                            "Workspace Tag",
                            "TAG",
                            "/tags",
                            tag.getWorkspaceId(),
                            null,
                            null,
                            null,
                            null,
                            tag.getColor() != null ? tag.getColor() : "#F59E0B",
                            tag.getCreatedAt()
                    ));
                }
            }
        }

        // 4. Search Comments
        if ("ALL".equals(typeFilter) || "COMMENT".equals(typeFilter)) {
            if (!query.isEmpty()) {
                List<CommentEntity> comments = commentRepository.searchComments(query);
                totalComments = comments.size();
                for (CommentEntity comment : comments) {
                    allItems.add(new SearchResultItemDto(
                            comment.getId(),
                            "Comment in Task",
                            comment.getContent(),
                            "COMMENT",
                            "/tasks?id=" + comment.getTaskId(),
                            null,
                            null,
                            comment.getTaskId(),
                            null,
                            null,
                            "#3B82F6",
                            comment.getCreatedAt()
                    ));
                }
            }
        }

        // Sorting
        if ("date".equalsIgnoreCase(params.getSortBy())) {
            if ("asc".equalsIgnoreCase(params.getSortOrder())) {
                allItems.sort(Comparator.comparing(SearchResultItemDto::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())));
            } else {
                allItems.sort(Comparator.comparing(SearchResultItemDto::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())));
            }
        } else if ("title".equalsIgnoreCase(params.getSortBy())) {
            if ("desc".equalsIgnoreCase(params.getSortOrder())) {
                allItems.sort(Comparator.comparing(SearchResultItemDto::getTitle, String.CASE_INSENSITIVE_ORDER).reversed());
            } else {
                allItems.sort(Comparator.comparing(SearchResultItemDto::getTitle, String.CASE_INSENSITIVE_ORDER));
            }
        }

        long totalElements = allItems.size();
        int page = Math.max(0, params.getPage());
        int size = Math.max(1, Math.min(params.getSize(), 100));
        int totalPages = (int) Math.ceil((double) totalElements / size);

        int fromIndex = page * size;
        List<SearchResultItemDto> pagedItems;
        if (fromIndex >= totalElements) {
            pagedItems = List.of();
        } else {
            int toIndex = Math.min(fromIndex + size, (int) totalElements);
            pagedItems = allItems.subList(fromIndex, toIndex);
        }

        boolean isLast = (page + 1) >= totalPages;

        return new GlobalSearchResultDto(
                pagedItems,
                totalTasks,
                totalProjects,
                totalTags,
                totalComments,
                totalElements,
                page,
                size,
                totalPages,
                isLast
        );
    }
}
