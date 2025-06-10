package com.blog.blog.services;

import com.blog.blog.domain.dtos.ContactRequestDto;
import com.blog.blog.domain.dtos.ContactResponseDto;

import java.util.List;
import java.util.UUID;

public interface ContactService {
    ContactResponseDto saveContactMessage(ContactRequestDto contactRequestDto);
    List<ContactResponseDto> getAllContactMessages();
    List<ContactResponseDto> getUnreadMessages();
    long countUnreadMessages();
    ContactResponseDto markAsRead(UUID id);
}