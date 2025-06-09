package com.blog.blog.mappers;

import com.blog.blog.domain.PostStatus;
import com.blog.blog.domain.dtos.TagDto;
import com.blog.blog.domain.entities.Post;
import com.blog.blog.domain.entities.Tag;
import org.mapstruct.*;

import java.util.Set;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TagMapper {

    @Mapping(target = "postCount", source = "posts", qualifiedByName = "calculatePostCount")
    TagDto toTagResponse(Tag tag);

    @Named("calculatePostCount")
    default Integer calculatePostCount(Set<Post> posts) {
        if(posts == null)
            return 0;
        posts.stream().filter(post -> PostStatus.PUBLISHED.equals(post.getStatus()))
                .count();
        return posts.size();
    }

}
