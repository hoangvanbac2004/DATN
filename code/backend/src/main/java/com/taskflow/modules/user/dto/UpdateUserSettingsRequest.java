package com.taskflow.modules.user.dto;

import jakarta.validation.constraints.Size;

public class UpdateUserSettingsRequest {

    @Size(max = 20, message = "Theme must not exceed 20 characters")
    private String theme;

    @Size(max = 10, message = "Language must not exceed 10 characters")
    private String language;

    @Size(max = 50, message = "Timezone must not exceed 50 characters")
    private String timezone;

    @Size(max = 20, message = "Date format must not exceed 20 characters")
    private String dateFormat;

    private Boolean emailNotifications;
    private Boolean desktopNotifications;
    private Boolean weeklyDigest;

    public UpdateUserSettingsRequest() {
    }

    public UpdateUserSettingsRequest(String theme, String language, String timezone, String dateFormat, Boolean emailNotifications, Boolean desktopNotifications, Boolean weeklyDigest) {
        this.theme = theme;
        this.language = language;
        this.timezone = timezone;
        this.dateFormat = dateFormat;
        this.emailNotifications = emailNotifications;
        this.desktopNotifications = desktopNotifications;
        this.weeklyDigest = weeklyDigest;
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
