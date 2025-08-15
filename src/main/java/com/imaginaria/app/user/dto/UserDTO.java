package com.imaginaria.app.user.dto;

import java.time.LocalDate;

public record UserDTO(Long id, String firstName, String lastName, String username, String email, String gender,
                      LocalDate birthDate, String status, String avatarUrl)
{
}
