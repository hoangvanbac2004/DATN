package com.taskflow.modules.notification.specification;

import com.taskflow.modules.notification.entity.NotificationEntity;
import org.springframework.data.jpa.domain.Specification;

public class NotificationSpecification {
    public static Specification<NotificationEntity> isUnread() {
        return (root, query, cb) -> cb.equal(root.get("read"), false);
    }
}
