package com.syntaxtype.demo.DTO.users;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminDTO {
    private Long adminId;
    private Long userId;
    private String firstName;
    private String lastName;
}
