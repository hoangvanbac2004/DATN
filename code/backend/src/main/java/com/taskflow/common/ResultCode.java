package com.taskflow.common;

public enum ResultCode {

    SUCCESS(200, "Operation completed successfully"),
    CREATED(201, "Resource created successfully"),
    BAD_REQUEST(400, "Invalid parameter or payload"),
    UNAUTHORIZED(401, "Authentication token missing or invalid"),
    FORBIDDEN(403, "Access denied"),
    NOT_FOUND(404, "Requested resource not found"),
    RESOURCE_NOT_FOUND(404, "Requested resource not found"),
    METHOD_NOT_ALLOWED(405, "HTTP method not supported"),
    CONFLICT(409, "Resource state conflict"),
    DATA_ALREADY_EXISTS(409, "Resource already exists"),
    VALIDATION_ERROR(422, "Validation failed"),
    INTERNAL_SERVER_ERROR(500, "Internal server error");

    private final int code;
    private final String message;

    ResultCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
