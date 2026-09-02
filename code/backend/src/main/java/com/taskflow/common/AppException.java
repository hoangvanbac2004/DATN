package com.taskflow.common;

public class AppException extends RuntimeException {

    private final ResultCode resultCode;

    public AppException(ResultCode resultCode) {
        super(resultCode.getMessage());
        this.resultCode = resultCode;
    }

    public AppException(ResultCode resultCode, String customMessage) {
        super(customMessage);
        this.resultCode = resultCode;
    }

    public AppException(String message) {
        super(message);
        this.resultCode = ResultCode.BAD_REQUEST;
    }

    public ResultCode getResultCode() {
        return resultCode;
    }
}
