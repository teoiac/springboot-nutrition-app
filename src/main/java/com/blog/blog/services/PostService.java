package com.blog.blog.services;

import com.blog.blog.domain.CreatePostRequest;
import com.blog.blog.domain.UpdatePostRequest;
import com.blog.blog.domain.dtos.CreatePostRequestDto;
import com.blog.blog.domain.dtos.UpdatePostRequestDto;
import com.blog.blog.domain.entities.Post;
import com.blog.blog.domain.entities.User;

import java.util.List;
import java.util.UUID;

public interface PostService {
    Post getPost(UUID id);
    List<Post> getAllPosts(UUID categoryId, UUID tagId);
    List<Post> getDraftPosts(User user);
    Post createPost(User user, CreatePostRequest createPostRequest);
    Post updatePost(UUID id, UpdatePostRequest updatePostRequest);  //se poate implementa ca sa editeze doar cine scrie postarea
    void deletePost(UUID id);
}
