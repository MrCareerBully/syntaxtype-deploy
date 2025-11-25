package com.syntaxtype.demo.DTO.junctions;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentTopicsDTO {
    private Long studentId;
    private Long topicId;
}
