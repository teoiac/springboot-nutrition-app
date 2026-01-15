package com.blog.blog.domain;

import lombok.*;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class CreatePostRequest {
    private String title;
    private String content;
    private UUID categoryId;

    @Builder.Default
    private Set<UUID> tagIds = new HashSet<>();
    private PostStatus status;

}
