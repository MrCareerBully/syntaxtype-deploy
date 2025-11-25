package com.syntaxtype.demo.Repository.lessons;

import com.syntaxtype.demo.Entity.Lessons.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScoreRepository extends JpaRepository<Score, Long> {
    List<Score> findByChallengeTypeOrderBySubmittedAtDesc(String challengeType);

    // Optional: Top N scores for falling test
}
