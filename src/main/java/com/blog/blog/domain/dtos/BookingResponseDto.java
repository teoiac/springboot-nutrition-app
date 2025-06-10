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
public class BookingResponseDto {
    private UUID id;
    private String name;
    private String email;
    private String phone;
    private String service;
    private LocalDateTime dateTime;
    private String message;
    private boolean confirmed;
    private LocalDateTime createdAt;
}