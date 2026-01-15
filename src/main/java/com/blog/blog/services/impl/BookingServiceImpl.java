package com.blog.blog.services.impl;

import com.blog.blog.domain.dtos.BookingRequestDto;
import com.blog.blog.domain.dtos.BookingResponseDto;
import com.blog.blog.domain.entities.Booking;
import com.blog.blog.mappers.BookingMapper;
import com.blog.blog.repositories.BookingRepository;
import com.blog.blog.services.BookingService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;

    @Override
    @Transactional
    public BookingResponseDto createBooking(BookingRequestDto bookingRequestDto) {
        Booking booking = bookingMapper.toBooking(bookingRequestDto);
        Booking savedBooking = bookingRepository.save(booking);
        return bookingMapper.toBookingResponseDto(savedBooking);
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDto> getUpcomingBookings() {
        return bookingRepository.findByDateTimeBetweenOrderByDateTime(
                        LocalDateTime.now(),
                        LocalDateTime.now().plusMonths(1))
                .stream()
                .map(bookingMapper::toBookingResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDto> getUnconfirmedBookings() {
        return bookingRepository.findByConfirmedFalseOrderByDateTime()
                .stream()
                .map(bookingMapper::toBookingResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<BookingResponseDto> getBookingsByEmail(String email) {
        return bookingRepository.findByEmailOrderByDateTimeDesc(email)
                .stream()
                .map(bookingMapper::toBookingResponseDto)
                .toList();
    }

    @Override
    @Transactional
    public BookingResponseDto confirmBooking(UUID id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Booking not found with id: " + id));
        booking.setConfirmed(true);
        Booking updatedBooking = bookingRepository.save(booking);
        return bookingMapper.toBookingResponseDto(updatedBooking);
    }

    @Override
    @Transactional
    public void cancelBooking(UUID id) {
        bookingRepository.deleteById(id);
    }
}