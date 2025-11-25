package com.syntaxtype.demo.Repository.statistics;

import com.syntaxtype.demo.Entity.Statistics.StudentAchievements;
import com.syntaxtype.demo.Entity.Users.Student;
import com.syntaxtype.demo.Entity.Statistics.Achievements;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface StudentAchievementsRepository extends JpaRepository<StudentAchievements, Long> {
    List<StudentAchievements> findByStudent(Student student);
    List<StudentAchievements> findByAchievementId(Achievements achievementId);
    List<StudentAchievements> findByAwardedAt(LocalDateTime awardedAt);
}
