package com.blog.blog.services.impl;

import com.blog.blog.domain.dtos.ContactRequestDto;
import com.blog.blog.domain.dtos.ContactResponseDto;
import com.blog.blog.domain.entities.ContactMessage;
import com.blog.blog.mappers.ContactMapper;
import com.blog.blog.repositories.ContactRepository;
import com.blog.blog.services.ContactService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContactServiceImpl implements ContactService {

    private final ContactRepository contactRepository;
    private final ContactMapper contactMapper;

    @Override
    @Transactional
    public ContactResponseDto saveContactMessage(ContactRequestDto contactRequestDto) {
        ContactMessage message = contactMapper.toContactMessage(contactRequestDto);
        ContactMessage savedMessage = contactRepository.save(message);
        return contactMapper.toContactResponseDto(savedMessage);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactResponseDto> getAllContactMessages() {
        return contactRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(contactMapper::toContactResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ContactResponseDto> getUnreadMessages() {
        return contactRepository.findByIsReadFalseOrderByCreatedAtDesc()
                .stream()
                .map(contactMapper::toContactResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public long countUnreadMessages() {
        return contactRepository.countByIsReadFalse();
    }

    @Override
    @Transactional
    public ContactResponseDto markAsRead(UUID id) {
        ContactMessage message = contactRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Contact message not found with id: " + id));
        message.setRead(true);
        ContactMessage updatedMessage = contactRepository.save(message);
        return contactMapper.toContactResponseDto(updatedMessage);
    }
}