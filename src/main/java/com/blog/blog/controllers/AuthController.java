package com.blog.blog.controllers;

import com.blog.blog.domain.dtos.*;
import com.blog.blog.domain.entities.User;
import com.blog.blog.repositories.UserRepository;
import com.blog.blog.security.AuthenticationService;
import com.blog.blog.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping(path = "/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;
    private final UserService userService;
    private final UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest){
        UserDetails userDetails = authenticationService.authenticate(
                loginRequest.getEmail(),
                loginRequest.getPassword());

        String tokenValue = authenticationService.generateToken(userDetails);
       AuthResponse authResponse = AuthResponse.builder()
                .token(tokenValue)
                .expiresIn(86400)
                .build();
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody UserRegisterRequest userRegisterRequest){
        return ResponseEntity.ok(userService.register(userRegisterRequest));
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getUserProfile(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserProfileResponse response = UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .admin(user.isAdmin())
                .build();

        return ResponseEntity.ok(response);
    }

}
