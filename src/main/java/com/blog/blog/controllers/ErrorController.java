package com.blog.blog.controllers;

import com.blog.blog.domain.dtos.ApiErrorResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;

@RestController
@ControllerAdvice
@Slf4j
public class ErrorController {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleException(Exception exception) {
        log.error("Caught exception", exception);
        ApiErrorResponse error = ApiErrorResponse.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .message("Unexpected error occurred.")
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalArgumentException(Exception exception, HttpStatus status) {
        ApiErrorResponse apiErrorResponse = ApiErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .message(exception.getMessage()) // not safe cause it shows sensitive info
                .build();
        return new ResponseEntity<>(apiErrorResponse, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalStateException(Exception exception, HttpStatus status) {
        ApiErrorResponse apiErrorResponse = ApiErrorResponse.builder()
                .status(HttpStatus.CONFLICT.value())
                .message(exception.getMessage()) // not safe cause it shows sensitive info
                .build();
        return new ResponseEntity<>(apiErrorResponse, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleBadCredentialsException(BadCredentialsException exception) {
        ApiErrorResponse apiErrorResponse = ApiErrorResponse.builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .message("Incorrect username or password")
                .build();
        return new ResponseEntity<>(apiErrorResponse, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleEntityNotFoundException(BadCredentialsException exception) {
        ApiErrorResponse apiErrorResponse = ApiErrorResponse.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .message(exception.getMessage())
                .build();
        return new ResponseEntity<>(apiErrorResponse, HttpStatus.NOT_FOUND);
    }
}
