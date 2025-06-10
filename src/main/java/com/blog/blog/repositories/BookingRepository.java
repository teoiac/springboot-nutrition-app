package com.blog.blog.repositories;

import com.blog.blog.domain.entities.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface BookingRepository extends JpaRepository<Booking, UUID> {
    List<Booking> findByDateTimeBetweenOrderByDateTime(LocalDateTime start, LocalDateTime end);
    List<Booking> findByConfirmedFalseOrderByDateTime();
    List<Booking> findByEmailOrderByDateTimeDesc(String email);
}