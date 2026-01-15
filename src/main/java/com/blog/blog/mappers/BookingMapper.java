package com.blog.blog.mappers;

import com.blog.blog.domain.dtos.BookingRequestDto;
import com.blog.blog.domain.dtos.BookingResponseDto;
import com.blog.blog.domain.entities.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BookingMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "confirmed", constant = "false")
    Booking toBooking(BookingRequestDto bookingRequestDto);

    BookingResponseDto toBookingResponseDto(Booking booking);
}