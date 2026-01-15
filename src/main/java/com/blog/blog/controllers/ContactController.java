package com.blog.blog.controllers;

import com.blog.blog.domain.dtos.ContactRequestDto;
import com.blog.blog.domain.dtos.ContactResponseDto;
import com.blog.blog.services.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<ContactResponseDto> createContactMessage(
            @Valid @RequestBody ContactRequestDto contactRequestDto) {
        ContactResponseDto response = contactService.saveContactMessage(contactRequestDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ContactResponseDto>> getAllContactMessages() {
        List<ContactResponseDto> messages = contactService.getAllContactMessages();
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/unread")
    public ResponseEntity<List<ContactResponseDto>> getUnreadMessages() {
        List<ContactResponseDto> messages = contactService.getUnreadMessages();
        return ResponseEntity.ok(messages);
    }

    @GetMapping("/unread/count")
    public ResponseEntity<Long> countUnreadMessages() {
        long count = contactService.countUnreadMessages();
        return ResponseEntity.ok(count);
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ContactResponseDto> markMessageAsRead(@PathVariable UUID id) {
        ContactResponseDto response = contactService.markAsRead(id);
        return ResponseEntity.ok(response);
    }
}