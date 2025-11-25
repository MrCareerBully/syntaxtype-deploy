package com.syntaxtype.demo.DTO.users;

import com.syntaxtype.demo.Entity.Enums.Role;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long userId;
    private String username;
    private String email;
    private String password;
    private Role userRole;
    private boolean isTempPassword;
    private LocalDateTime createdAt;
}
