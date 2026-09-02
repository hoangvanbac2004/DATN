package com.taskflow.modules.user.mapper;

import com.taskflow.modules.user.dto.UserSettingsDto;
import com.taskflow.modules.user.entity.UserSettingsEntity;
import org.springframework.stereotype.Component;

@Component
public class UserSettingsMapper {

    public UserSettingsDto toDto(UserSettingsEntity entity) {
        if (entity == null) {
            return null;
        }

        return new UserSettingsDto(
                entity.getUserId(),
                entity.getTheme(),
                entity.getLanguage(),
                entity.getTimezone(),
                entity.getDateFormat(),
                entity.getEmailNotifications(),
                entity.getDesktopNotifications(),
                entity.getWeeklyDigest()
        );
    }
}
