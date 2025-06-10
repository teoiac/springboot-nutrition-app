package com.blog.blog.repositories;

import com.blog.blog.domain.entities.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ContactRepository extends JpaRepository<ContactMessage, UUID> {
    List<ContactMessage> findAllByOrderByCreatedAtDesc();
    List<ContactMessage> findByIsReadFalseOrderByCreatedAtDesc();
    long countByIsReadFalse();
}