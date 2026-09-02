package com.taskflow.modules.task.repository;

import com.taskflow.modules.task.entity.TaskDependencyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaskDependencyRepository extends JpaRepository<TaskDependencyEntity, UUID> {

    List<TaskDependencyEntity> findByPredecessorIdAndIsDeletedFalse(UUID predecessorId);

    List<TaskDependencyEntity> findBySuccessorIdAndIsDeletedFalse(UUID successorId);

    Optional<TaskDependencyEntity> findByPredecessorIdAndSuccessorIdAndIsDeletedFalse(UUID predecessorId, UUID successorId);
}
