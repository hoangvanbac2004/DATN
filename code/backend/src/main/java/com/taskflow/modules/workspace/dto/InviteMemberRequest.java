package com.taskflow.modules.workspace.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class InviteMemberRequest {

    @NotBlank(message = "Email must not be blank")
    @Email(message = "Must be a valid email address")
    private String email;

    private String role = "MEMBER";

    public InviteMemberRequest() {
    }

    public InviteMemberRequest(String email, String role) {
        this.email = email;
        this.role = role != null ? role : "MEMBER";
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
