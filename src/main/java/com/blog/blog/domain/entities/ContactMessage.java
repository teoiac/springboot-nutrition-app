package com.blog.blog.domain.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "contact_messages")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Column
    private boolean isRead;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.isRead = false;
    }
}