package com.taskflow.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component("permissionChecker")
public class PermissionChecker {

    public boolean hasPermission(String permission) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        return auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equalsIgnoreCase(permission) || a.equals("ROLE_ADMIN"));
    }

    public boolean hasWorkspacePermission(UUID workspaceId, String permission) {
        return hasPermission(permission);
    }

    public boolean hasProjectPermission(UUID projectId, String permission) {
        return hasPermission(permission);
    }

    public boolean isAdmin() {
        return hasPermission("ROLE_ADMIN");
    }
}
