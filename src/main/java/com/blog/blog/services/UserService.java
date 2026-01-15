package com.blog.blog.services;

import com.blog.blog.domain.dtos.UserRegisterRequest;
import com.blog.blog.domain.dtos.UserResponse;
import com.blog.blog.domain.entities.User;

import java.util.UUID;

public interface UserService {
    User getUserById(UUID id);
    UserResponse register(UserRegisterRequest request);
}
