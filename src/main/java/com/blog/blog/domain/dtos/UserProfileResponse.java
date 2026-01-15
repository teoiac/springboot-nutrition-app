package com.blog.blog.domain.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfileResponse {
    private UUID id;
    private String name;
    private String email;
    @JsonProperty("isAdmin")
    private boolean admin;
    private LocalDateTime createdAt;

    // - profile picture URL
    // - user bio
    // -
}