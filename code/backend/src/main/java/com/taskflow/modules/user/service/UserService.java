package com.taskflow.modules.user.service;

import com.taskflow.modules.user.dto.ChangePasswordRequest;
import com.taskflow.modules.user.dto.UpdateProfileRequest;
import com.taskflow.modules.user.dto.UpdateUserSettingsRequest;
import com.taskflow.modules.user.dto.UserDto;
import com.taskflow.modules.user.dto.UserSettingsDto;
import com.taskflow.modules.user.entity.UserEntity;

import java.util.UUID;

/**
 * Domain Service interface for managing user accounts, profiles, preferences, and password modifications.
 */
public interface UserService {

    /**
     * Retrieves public profile DTO of an authenticated user.
     *
     * @param userId UUID identifier of the user
     * @return UserDto profile representation
     */
    UserDto getCurrentUserProfile(UUID userId);

    /**
     * Updates user full name and avatar image URL.
     *
     * @param userId  UUID identifier of the user
     * @param request payload containing updated full name and avatar URL
     * @return updated UserDto profile
     */
    UserDto updateProfile(UUID userId, UpdateProfileRequest request);

    /**
     * Verifies current password and updates to a BCrypt-encoded new password.
     *
     * @param userId  UUID identifier of the user
     * @param request payload containing current and new password
     */
    void changePassword(UUID userId, ChangePasswordRequest request);

    /**
     * Retrieves user preference settings (theme, language, timezone, date format, notifications).
     *
     * @param userId UUID identifier of the user
     * @return UserSettingsDto preference configuration
     */
    UserSettingsDto getUserSettings(UUID userId);

    /**
     * Updates user preference settings.
     *
     * @param userId  UUID identifier of the user
     * @param request payload containing updated preference parameters
     * @return updated UserSettingsDto
     */
    UserSettingsDto updateUserSettings(UUID userId, UpdateUserSettingsRequest request);

    /**
     * Internal lookup returning UserEntity with roles and permissions populated.
     *
     * @param userId UUID identifier of the user
     * @return UserEntity JPA domain object
     */
    UserEntity findEntityById(UUID userId);

    /**
     * Internal lookup returning UserEntity by email address.
     *
     * @param email unique user email address
     * @return UserEntity JPA domain object
     */
    UserEntity findEntityByEmail(String email);
}
