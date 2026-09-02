package com.taskflow.modules.search.dto;

import java.util.List;

public class GlobalSearchResultDto {

    private List<SearchResultItemDto> items;
    private long totalTasks;
    private long totalProjects;
    private long totalTags;
    private long totalComments;
    private long totalElements;
    private int page;
    private int size;
    private int totalPages;
    private boolean last;

    public GlobalSearchResultDto() {
    }

    public GlobalSearchResultDto(List<SearchResultItemDto> items, long totalTasks, long totalProjects, long totalTags, long totalComments, long totalElements, int page, int size, int totalPages, boolean last) {
        this.items = items;
        this.totalTasks = totalTasks;
        this.totalProjects = totalProjects;
        this.totalTags = totalTags;
        this.totalComments = totalComments;
        this.totalElements = totalElements;
        this.page = page;
        this.size = size;
        this.totalPages = totalPages;
        this.last = last;
    }

    public List<SearchResultItemDto> getItems() {
        return items;
    }

    public void setItems(List<SearchResultItemDto> items) {
        this.items = items;
    }

    public long getTotalTasks() {
        return totalTasks;
    }

    public void setTotalTasks(long totalTasks) {
        this.totalTasks = totalTasks;
    }

    public long getTotalProjects() {
        return totalProjects;
    }

    public void setTotalProjects(long totalProjects) {
        this.totalProjects = totalProjects;
    }

    public long getTotalTags() {
        return totalTags;
    }

    public void setTotalTags(long totalTags) {
        this.totalTags = totalTags;
    }

    public long getTotalComments() {
        return totalComments;
    }

    public void setTotalComments(long totalComments) {
        this.totalComments = totalComments;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
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

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public boolean isLast() {
        return last;
    }

    public void setLast(boolean last) {
        this.last = last;
    }
}
