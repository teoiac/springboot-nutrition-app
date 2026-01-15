package com.blog.blog.services;

import com.blog.blog.domain.dtos.BookingRequestDto;
import com.blog.blog.domain.dtos.BookingResponseDto;

import java.util.List;
import java.util.UUID;

public interface BookingService {
    public BookingResponseDto createBooking(BookingRequestDto bookingRequestDto);
    public List<BookingResponseDto> getUpcomingBookings();
    public List<BookingResponseDto> getUnconfirmedBookings();
    public List<BookingResponseDto> getBookingsByEmail(String email);
    public BookingResponseDto confirmBooking(UUID id);
    public void cancelBooking(UUID id);
}
