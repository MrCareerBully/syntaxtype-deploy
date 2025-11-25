package com.syntaxtype.demo.Repository.statistics;

import com.syntaxtype.demo.Entity.Statistics.Achievements;
import com.syntaxtype.demo.Entity.Users.Teacher;
import com.syntaxtype.demo.Entity.Lessons.Topics;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AchievementsRepository extends JpaRepository<Achievements, Long> {
    List<Achievements> findByName(String name);
    List<Achievements> findByDescription(String description);
    List<Achievements> findByCreatedBy(Teacher createdBy);
    List<Achievements> findByTopicId(Topics topicId);
    List<Achievements> findByCreatedAt(LocalDateTime createdAt);
    List<Achievements> findByTriggerType(String triggerType);
    List<Achievements> findByTriggerValue(Integer triggerValue);
}
