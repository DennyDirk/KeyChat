package com.imaginaria.app.user.mapper;

import com.imaginaria.app.user.dto.UserDTO;
import com.imaginaria.app.user.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper
{
    public UserDTO toDto(User user)
    {
        return new UserDTO(user.getId(), user.getFirstName(), user.getLastName(), user.getUsername(), user.getEmail(),
                user.getGender().toString(), user.getBirthDate(), user.getStatus().toString(),
                user.getAvatarUrl());
    }
}
