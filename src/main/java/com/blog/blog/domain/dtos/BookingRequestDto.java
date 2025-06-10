package com.blog.blog.domain.dtos;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookingRequestDto {
    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must be less than 100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 100, message = "Email must be less than 100 characters")
    private String email;

    @Size(max = 20, message = "Phone must be less than 20 characters")
    private String phone;

    @NotBlank(message = "Service is required")
    private String service;

    @NotNull(message = "Date and time is required")
    private LocalDateTime dateTime;

    @Size(max = 1000, message = "Message must be less than 1000 characters")
    private String message;
}