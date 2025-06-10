package com.blog.blog.mappers;

import com.blog.blog.domain.dtos.ContactRequestDto;
import com.blog.blog.domain.dtos.ContactResponseDto;
import com.blog.blog.domain.entities.ContactMessage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring")
public interface ContactMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "isRead", ignore = true)
    ContactMessage toContactMessage(ContactRequestDto contactRequestDto);

    ContactResponseDto toContactResponseDto(ContactMessage contactMessage);
}