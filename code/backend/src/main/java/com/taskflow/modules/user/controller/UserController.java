package com.taskflow.modules.user.controller;

import com.taskflow.common.ApiResponse;
import com.taskflow.modules.user.dto.ChangePasswordRequest;
import com.taskflow.modules.user.dto.UpdateProfileRequest;
import com.taskflow.modules.user.dto.UpdateUserSettingsRequest;
import com.taskflow.modules.user.dto.UserDto;
import com.taskflow.modules.user.dto.UserSettingsDto;
import com.taskflow.modules.user.service.UserService;
import com.taskflow.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "User Management", description = "Endpoints for user profile, settings, and password management")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(@AuthenticationPrincipal UserPrincipal principal) {
        UserDto profile = userService.getCurrentUserProfile(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("User profile retrieved successfully", profile));
    }

    @PutMapping("/me")
    @Operation(summary = "Update current user profile")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserDto updated = userService.updateProfile(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @PutMapping("/me/password")
    @Operation(summary = "Change current user password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ChangePasswordRequest request) {
        userService.changePassword(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }

    @GetMapping("/me/settings")
    @Operation(summary = "Get current user settings & preferences")
    public ResponseEntity<ApiResponse<UserSettingsDto>> getUserSettings(@AuthenticationPrincipal UserPrincipal principal) {
        UserSettingsDto settings = userService.getUserSettings(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("User settings retrieved successfully", settings));
    }

    @PutMapping("/me/settings")
    @Operation(summary = "Update current user settings & preferences")
    public ResponseEntity<ApiResponse<UserSettingsDto>> updateUserSettings(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody UpdateUserSettingsRequest request) {
        UserSettingsDto updated = userService.updateUserSettings(principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("User settings updated successfully", updated));
    }
}
