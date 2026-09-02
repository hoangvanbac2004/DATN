package com.taskflow.modules.tag.entity;

import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

public class TaskTagId implements Serializable {

    private UUID taskId;
    private UUID tagId;

    public TaskTagId() {
    }

    public TaskTagId(UUID taskId, UUID tagId) {
        this.taskId = taskId;
        this.tagId = tagId;
    }

    public UUID getTaskId() {
        return taskId;
    }

    public void setTaskId(UUID taskId) {
        this.taskId = taskId;
    }

    public UUID getTagId() {
        return tagId;
    }

    public void setTagId(UUID tagId) {
        this.tagId = tagId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TaskTagId taskTagId = (TaskTagId) o;
        return Objects.equals(taskId, taskTagId.taskId) && Objects.equals(tagId, taskTagId.tagId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(taskId, tagId);
    }
}
