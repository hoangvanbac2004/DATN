package com.taskflow.modules.user.specification;

import com.taskflow.modules.user.entity.UserEntity;
import org.springframework.data.jpa.domain.Specification;

public class UserSpecification {
    public static Specification<UserEntity> hasEmail(String email) {
        return (root, query, cb) -> cb.equal(root.get("email"), email);
    }
}
