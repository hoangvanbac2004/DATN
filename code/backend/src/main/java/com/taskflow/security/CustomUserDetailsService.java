package com.taskflow.security;

import com.taskflow.modules.user.entity.UserEntity;
import com.taskflow.modules.user.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity user = userRepository.findByEmailWithRolesAndPermissions(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        if (Boolean.TRUE.equals(user.getIsDeleted()) || "DELETED".equalsIgnoreCase(user.getStatus())) {
            throw new UsernameNotFoundException("Tài khoản này đã bị xóa khỏi hệ thống: " + email);
        }

        Set<GrantedAuthority> authorities = new HashSet<>();
        if (user.getRoles() != null) {
            user.getRoles().forEach(role -> {
                authorities.add(new SimpleGrantedAuthority(role.getName()));
                if (role.getPermissions() != null) {
                    role.getPermissions().forEach(permission ->
                            authorities.add(new SimpleGrantedAuthority(permission.getName())));
                }
            });
        }

        boolean accountNonLocked = !"LOCKED".equalsIgnoreCase(user.getStatus()) && !"BLOCKED".equalsIgnoreCase(user.getStatus());
        boolean enabled = !"INACTIVE".equalsIgnoreCase(user.getStatus()) && !"DELETED".equalsIgnoreCase(user.getStatus()) && !Boolean.TRUE.equals(user.getIsDeleted());

        return new UserPrincipal(
                user.getId(),
                user.getEmail(),
                user.getPassword(),
                authorities,
                enabled,
                accountNonLocked
        );
    }
}
