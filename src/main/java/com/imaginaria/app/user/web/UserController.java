package com.imaginaria.app.user.web;

import com.imaginaria.app.user.dto.UserDTO;
import com.imaginaria.app.user.mapper.UserMapper;
import com.imaginaria.app.user.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController
{

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    // Получить всех юзеров (переделать под пейджинг можно)
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers()
    {
        List<UserDTO> users = userRepository.findAll()
                .stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    // Получить одного юзера по ID
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id)
    {
        return userRepository.findById(id)
                .map(userMapper::toDto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
