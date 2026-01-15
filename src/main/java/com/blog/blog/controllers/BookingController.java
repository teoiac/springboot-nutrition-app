package com.blog.blog.controllers;

import com.blog.blog.domain.dtos.BookingRequestDto;
import com.blog.blog.domain.dtos.BookingResponseDto;
import com.blog.blog.services.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponseDto> createBooking(
            @RequestBody @Valid BookingRequestDto bookingRequestDto) {
        BookingResponseDto response = bookingService.createBooking(bookingRequestDto);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<BookingResponseDto>> getUpcomingBookings() {
        List<BookingResponseDto> response = bookingService.getUpcomingBookings();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/unconfirmed")
    public ResponseEntity<List<BookingResponseDto>> getUnconfirmedBookings() {
        List<BookingResponseDto> response = bookingService.getUnconfirmedBookings();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<List<BookingResponseDto>> getBookingsByEmail(
            @PathVariable String email) {
        List<BookingResponseDto> response = bookingService.getBookingsByEmail(email);
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/confirm")
    public ResponseEntity<BookingResponseDto> confirmBooking(
            @PathVariable UUID id) {
        BookingResponseDto response = bookingService.confirmBooking(id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(
            @PathVariable UUID id) {
        bookingService.cancelBooking(id);
        return ResponseEntity.noContent().build();
    }
}