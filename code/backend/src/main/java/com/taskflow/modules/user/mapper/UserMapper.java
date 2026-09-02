package com.taskflow.modules.user.mapper;

import com.taskflow.modules.user.dto.UserDto;
import com.taskflow.modules.user.entity.RoleEntity;
import com.taskflow.modules.user.entity.UserEntity;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.stream.Collectors;

@Component
public class UserMapper {

    public UserDto toDto(UserEntity entity) {
        if (entity == null) {
            return null;
        }

        return new UserDto(
                entity.getId(),
                entity.getEmail(),
                entity.getFullName(),
                entity.getAvatarUrl(),
                entity.getIsEmailVerified(),
                entity.getStatus(),
                entity.getRoles() == null ? Collections.emptySet() :
                        entity.getRoles().stream()
                                .map(RoleEntity::getName)
                                .collect(Collectors.toSet()),
                entity.getCreatedAt(),
                entity.getUpdatedAt()
        );
    }
}
