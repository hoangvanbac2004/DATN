package com.taskflow.modules.tag.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UpdateTagRequest {

    @NotBlank(message = "Tag name must not be blank")
    @Size(max = 50, message = "Tag name must not exceed 50 characters")
    private String name;

    @Pattern(regexp = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", message = "Invalid HEX color format")
    private String color;

    public UpdateTagRequest() {
    }

    public UpdateTagRequest(String name, String color) {
        this.name = name;
        this.color = color;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
