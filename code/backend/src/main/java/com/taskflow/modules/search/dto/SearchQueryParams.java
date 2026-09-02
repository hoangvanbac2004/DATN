package com.taskflow.modules.search.dto;

import java.util.UUID;

public class SearchQueryParams {

    private String query;
    private String type; // ALL, TASK, PROJECT, TAG, COMMENT
    private UUID workspaceId;
    private UUID projectId;
    private String status;
    private String priority;
    private String sortBy = "relevance"; // relevance, date, title
    private String sortOrder = "desc";   // asc, desc
    private int page = 0;
    private int size = 20;

    public SearchQueryParams() {
    }

    public SearchQueryParams(String query, String type, UUID workspaceId, UUID projectId, String status, String priority, String sortBy, String sortOrder, int page, int size) {
        this.query = query;
        this.type = type;
        this.workspaceId = workspaceId;
        this.projectId = projectId;
        this.status = status;
        this.priority = priority;
        this.sortBy = sortBy;
        this.sortOrder = sortOrder;
        this.page = page;
        this.size = size;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public UUID getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(UUID workspaceId) {
        this.workspaceId = workspaceId;
    }

    public UUID getProjectId() {
        return projectId;
    }

    public void setProjectId(UUID projectId) {
        this.projectId = projectId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getSortBy() {
        return sortBy;
    }

    public void setSortBy(String sortBy) {
        this.sortBy = sortBy;
    }

    public String getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(String sortOrder) {
        this.sortOrder = sortOrder;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }
}
