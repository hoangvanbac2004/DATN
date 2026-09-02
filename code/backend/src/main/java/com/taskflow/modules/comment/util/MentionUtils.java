package com.taskflow.modules.comment.util;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class MentionUtils {

    // Regex matching @[Name](UUID) or @UUID
    private static final Pattern MENTION_PATTERN = Pattern.compile("(?i)@\\[([^]]+)\\]\\(([a-f0-9-]{36})\\)|@([a-f0-9-]{36})");

    public static List<UUID> parseMentionedUserIds(String content) {
        if (content == null || content.isBlank()) {
            return List.of();
        }

        List<UUID> userIds = new ArrayList<>();
        Matcher matcher = MENTION_PATTERN.matcher(content);
        while (matcher.find()) {
            String uuidStr = matcher.group(1) != null ? matcher.group(1) : matcher.group(2);
            try {
                if (uuidStr != null) {
                    userIds.add(UUID.fromString(uuidStr));
                }
            } catch (IllegalArgumentException ignored) {
            }
        }
        return userIds.stream().distinct().collect(Collectors.toList());
    }

    public static String serializeMentionedUserIds(List<UUID> userIds) {
        if (userIds == null || userIds.isEmpty()) {
            return null;
        }
        return userIds.stream().map(UUID::toString).collect(Collectors.joining(","));
    }

    public static List<UUID> deserializeMentionedUserIds(String raw) {
        if (raw == null || raw.isBlank()) {
            return List.of();
        }
        return Arrays.stream(raw.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(s -> {
                    try {
                        return UUID.fromString(s);
                    } catch (IllegalArgumentException e) {
                        return null;
                    }
                })
                .filter(u -> u != null)
                .collect(Collectors.toList());
    }
}
