
package com.blog.blog.domain.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ContactResponseDto {
    private UUID id;
    private String name;
    private String email;
    private String message;
    private LocalDateTime createdAt;
    private boolean isRead;
}