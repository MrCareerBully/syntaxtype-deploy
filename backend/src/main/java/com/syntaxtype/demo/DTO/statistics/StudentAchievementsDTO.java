package com.syntaxtype.demo.DTO.statistics;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentAchievementsDTO {
    private Long studentAchievementId;
    private Long studentId;
    private Long achievementId;
    private LocalDateTime awardedAt;
}
