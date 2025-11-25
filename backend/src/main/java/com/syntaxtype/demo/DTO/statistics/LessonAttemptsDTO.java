package com.syntaxtype.demo.DTO.statistics;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LessonAttemptsDTO {
    private Long lessonAttemptsId;
    private Long studentId;
    private Long lessonId;
    private Integer wpm;
    private Integer accuracy;
    private Integer completionTime;
    private LocalDateTime attemptedAt;
}
