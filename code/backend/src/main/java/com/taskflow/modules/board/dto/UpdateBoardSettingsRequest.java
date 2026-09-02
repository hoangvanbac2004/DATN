package com.taskflow.modules.board.dto;

public class UpdateBoardSettingsRequest {

    private String name;

    private String description;

    private BoardSettingsDto settings;

    public UpdateBoardSettingsRequest() {
    }

    public UpdateBoardSettingsRequest(String name, String description, BoardSettingsDto settings) {
        this.name = name;
        this.description = description;
        this.settings = settings;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BoardSettingsDto getSettings() {
        return settings;
    }

    public void setSettings(BoardSettingsDto settings) {
        this.settings = settings;
    }
}
