package com.blog.blog.services.impl;

import com.blog.blog.domain.dtos.UserRegisterRequest;
import com.blog.blog.domain.dtos.UserResponse;
import com.blog.blog.domain.entities.User;
import com.blog.blog.repositories.UserRepository;
import com.blog.blog.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public User getUserById(UUID id) {
        return userRepository
                .findById(id)
                .orElseThrow(()-> new EntityNotFoundException("User not found with  id " + id));
    }

    @Override
    public UserResponse register(UserRegisterRequest request) {
        if(userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        if(request.isAdmin()) {
            if(!request.getEmail().equals("nico_asaftei@admin.com")){
                throw new IllegalArgumentException("Only specific emails can register as admin");
            }
        }
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .isAdmin(request.isAdmin())
                .build();
        User savedUser = userRepository.save(user);

        UserResponse userResponse = new UserResponse();
        userResponse.setId(savedUser.getId());
        userResponse.setName(savedUser.getName());
        userResponse.setEmail(savedUser.getEmail());
        userResponse.setCreatedAt(savedUser.getCreatedAt());

        return userResponse;
    }
}
