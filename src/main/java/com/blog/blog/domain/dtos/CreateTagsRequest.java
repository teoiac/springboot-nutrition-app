package com.blog.blog.domain.dtos;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateTagsRequest {

    @NotEmpty(message = "At least one tag name is needed")
    @Size(max = 10, message = "Maximum {max} tags allowed")
    private Set<
            @Size(min=2, max=30, message = "Tag name must be in {min} and {max} characters range")
            @Pattern(regexp = "[\\w\\s-]+$",message = "Tag name contains only letters, numbers, spaces and - ")String>
    names;

}
