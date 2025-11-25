package com.syntaxtype.demo.Repository.statistics;

import com.syntaxtype.demo.Entity.Statistics.LessonAttempts;
import com.syntaxtype.demo.Entity.Users.Student;
import com.syntaxtype.demo.Entity.Lessons.Challenge;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface LessonAttemptsRepository extends JpaRepository<LessonAttempts, Long> {
    List<LessonAttempts> findByStudent(Student student);
    List<LessonAttempts> findByLesson(Challenge lesson);
    List<LessonAttempts> findByWpm(Integer wpm);
    List<LessonAttempts> findByAccuracy(Integer accuracy);
    List<LessonAttempts> findByCompletionTime(Integer completionTime);
    List<LessonAttempts> findByAttemptedAt(LocalDateTime attemptedAt);
}