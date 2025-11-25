package com.syntaxtype.demo.Entity.Statistics;

import java.time.LocalDateTime;

import com.syntaxtype.demo.Entity.Lessons.Topics;
import com.syntaxtype.demo.Entity.Users.Teacher;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "achievements")
@Builder
public class Achievements {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long achievementId;

    private String name;
    private String description;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    private Teacher createdBy;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id")
    private Topics topicId;

    private LocalDateTime createdAt;
    private String triggerType; // e.g. "WPM", "CompletionCount", "TimeSpent"
    private Integer triggerValue; // e.g. 100 for 100 WPM, 10 for 10 lessons completed, etc.
}