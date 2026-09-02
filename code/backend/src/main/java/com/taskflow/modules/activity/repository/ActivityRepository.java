package com.taskflow.modules.activity.repository;

import com.taskflow.modules.activity.entity.ActivityEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ActivityRepository extends JpaRepository<ActivityEntity, UUID> {
}
