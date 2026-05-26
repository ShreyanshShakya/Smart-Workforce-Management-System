package com.wms.config;

import com.wms.security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration

public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    public SecurityConfig(
            JwtAuthenticationFilter jwtFilter,
            CorsConfigurationSource corsConfigurationSource
    ) {

        this.jwtFilter = jwtFilter;

        this.corsConfigurationSource =
                corsConfigurationSource;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                .cors(cors -> cors.configurationSource(
                        corsConfigurationSource
                ))
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        /*
                         * PUBLIC AUTH APIs
                         */

                        .requestMatchers("/api/auth/**")
                        .permitAll()

                        /*
                         * SWAGGER / OPENAPI
                         */

                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        )
                        .permitAll()

                        /*
                         * USER APIs
                         */

                        .requestMatchers("/api/users")
                        .permitAll()

                        .requestMatchers("/api/users/protected")
                        .authenticated()

                        .requestMatchers("/api/users/admin")
                        .hasRole("ADMIN")

                        /*
                         * EMPLOYEE TASK ACCESS
                         */

                        .requestMatchers(
                                "/api/tasks/my-tasks"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "MANAGER",
                                "EMPLOYEE"
                        )

                        .requestMatchers(
                                HttpMethod.PUT,
                                "/api/tasks/*/status"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "MANAGER",
                                "EMPLOYEE"
                        )

                        /*
                         * DASHBOARD / ANALYTICS
                         */

                        .requestMatchers(
                                "/api/tasks/status/**",
                                "/api/tasks/priority/**",
                                "/api/tasks/overdue"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "MANAGER"
                        )

                        /*
                         * TASK MANAGEMENT
                         */

                        .requestMatchers(
                                "/api/tasks/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "MANAGER"
                        )

                        /*
                         * EVERYTHING ELSE
                         */

                        .anyRequest()
                        .authenticated()
                )

                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}