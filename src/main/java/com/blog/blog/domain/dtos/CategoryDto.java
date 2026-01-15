package com.blog.blog.domain.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;


//dto - data transfer object

@Data // most boilerplate code
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategoryDto {
    private UUID id;
    private String name;
    private long postCount;
}
