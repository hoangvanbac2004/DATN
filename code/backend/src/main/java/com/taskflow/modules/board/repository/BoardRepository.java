package com.taskflow.modules.board.repository;

import com.taskflow.modules.board.entity.BoardEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BoardRepository extends JpaRepository<BoardEntity, UUID> {

    Optional<BoardEntity> findByProjectIdAndIsDeletedFalse(UUID projectId);

    Optional<BoardEntity> findByIdAndIsDeletedFalse(UUID boardId);
}
