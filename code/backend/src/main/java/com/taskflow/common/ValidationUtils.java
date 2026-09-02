package com.taskflow.common;

import java.util.regex.Pattern;

public final class ValidationUtils {

    private ValidationUtils() {}

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    public static boolean isValidEmail(String email) {
        if (email == null) return false;
        return EMAIL_PATTERN.matcher(email).matches();
    }
}
