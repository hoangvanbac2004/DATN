package com.taskflow.modules.user.dto;

import java.util.UUID;

public class UserSettingsDto {
    private UUID userId;
    private String theme;
    private String language;
    private String timezone;
    private String dateFormat;
    private Boolean emailNotifications;
    private Boolean desktopNotifications;
    private Boolean weeklyDigest;

    public UserSettingsDto() {
    }

    public UserSettingsDto(UUID userId, String theme, String language, String timezone, String dateFormat, Boolean emailNotifications, Boolean desktopNotifications, Boolean weeklyDigest) {
        this.userId = userId;
        this.theme = theme;
        this.language = language;
        this.timezone = timezone;
        this.dateFormat = dateFormat;
        this.emailNotifications = emailNotifications;
        this.desktopNotifications = desktopNotifications;
        this.weeklyDigest = weeklyDigest;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public String getDateFormat() {
        return dateFormat;
    }

    public void setDateFormat(String dateFormat) {
        this.dateFormat = dateFormat;
    }

    public Boolean getEmailNotifications() {
        return emailNotifications;
    }

    public void setEmailNotifications(Boolean emailNotifications) {
        this.emailNotifications = emailNotifications;
    }

    public Boolean getDesktopNotifications() {
        return desktopNotifications;
    }

    public void setDesktopNotifications(Boolean desktopNotifications) {
        this.desktopNotifications = desktopNotifications;
    }

    public Boolean getWeeklyDigest() {
        return weeklyDigest;
    }

    public void setWeeklyDigest(Boolean weeklyDigest) {
        this.weeklyDigest = weeklyDigest;
    }
}
