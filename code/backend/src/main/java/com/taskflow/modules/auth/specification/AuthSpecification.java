package com.taskflow.modules.auth.specification;

import com.taskflow.modules.auth.entity.AuthTokenEntity;
import org.springframework.data.jpa.domain.Specification;

public class AuthSpecification {
    public static Specification<AuthTokenEntity> isNotRevoked() {
        return (root, query, cb) -> cb.equal(root.get("revoked"), false);
    }
}
