package com.taskflow.modules.board.repository;

import com.taskflow.modules.board.entity.BoardColumnEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BoardColumnRepository extends JpaRepository<BoardColumnEntity, UUID> {

    List<BoardColumnEntity> findByBoardIdAndIsDeletedFalseOrderByPositionAsc(UUID boardId);

    Optional<BoardColumnEntity> findByIdAndIsDeletedFalse(UUID id);
}
