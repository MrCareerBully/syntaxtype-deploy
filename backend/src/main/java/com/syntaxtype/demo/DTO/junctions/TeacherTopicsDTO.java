package com.syntaxtype.demo.DTO.junctions;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TeacherTopicsDTO {
    private Long teacherId;
    private Long topicId;
}
