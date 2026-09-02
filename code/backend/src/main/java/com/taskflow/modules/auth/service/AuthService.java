package com.taskflow.modules.auth.service;

import com.taskflow.modules.auth.dto.AuthResponse;
import com.taskflow.modules.auth.dto.LoginRequest;
import com.taskflow.modules.auth.dto.RefreshTokenRequest;
import com.taskflow.modules.auth.dto.RegisterRequest;

/**
 * Service interface for managing user authentication lifecycle including registration,
 * credential validation, JWT token issuance, and session revocation.
 */
public interface AuthService {

    /**
     * Registers a new user account with default user privileges.
     *
     * @param request the registration details including email, password, and full name
     * @return the newly registered UserDto wrapped in AuthResponse
     */
    AuthResponse register(RegisterRequest request);

    /**
     * Authenticates user credentials and issues Access and Refresh tokens.
     *
     * @param request the user login credentials (email and password)
     * @return AuthResponse containing access token, refresh token, and user profile
     */
    AuthResponse login(LoginRequest request);

    /**
     * Issues a fresh Access token using a valid Refresh token.
     *
     * @param request the refresh token request payload
     * @return AuthResponse with updated access token
     */
    AuthResponse refreshToken(RefreshTokenRequest request);

    /**
     * Revokes user session and invalidates active tokens.
     *
     * @param token the bearer token string
     */
    void logout(String token);
}
