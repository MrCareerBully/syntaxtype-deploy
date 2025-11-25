package com.syntaxtype.demo.DTO.users.responses;

import com.syntaxtype.demo.DTO.users.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountSetupResponse {
    private String token;
    private UserDTO user;
}