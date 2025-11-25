package com.syntaxtype.demo.DTO.users.requests;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentUpdateRequest {
    private String firstname;
    private String lastname;
    private String universityEmail;
    private String course;
    private String yearLevel;
    private String className;
    private String section;
}
