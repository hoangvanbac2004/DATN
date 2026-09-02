package com.taskflow.modules.user.entity;

import com.taskflow.common.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "user_settings")
public class UserSettingsEntity extends BaseEntity {

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    @Column(name = "theme", nullable = false, length = 20)
    private String theme = "dark";

    @Column(name = "language", nullable = false, length = 10)
    private String language = "en";

    @Column(name = "timezone", nullable = false, length = 50)
    private String timezone = "UTC";

    @Column(name = "date_format", nullable = false, length = 20)
    private String dateFormat = "YYYY-MM-DD";

    @Column(name = "email_notifications", nullable = false)
    private Boolean emailNotifications = true;

    @Column(name = "desktop_notifications", nullable = false)
    private Boolean desktopNotifications = true;

    @Column(name = "weekly_digest", nullable = false)
    private Boolean weeklyDigest = true;

    public UserSettingsEntity() {
    }

    public UserSettingsEntity(UUID userId) {
        this.userId = userId;
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
