package com.imaginaria.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // Отключаем CSRF
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll() // Разрешаем всё
                )
                .formLogin(AbstractHttpConfigurer::disable) // Убираем форму логина
                .httpBasic(AbstractHttpConfigurer::disable); // Отключаем Basic Auth

        return http.build();
    }
}
