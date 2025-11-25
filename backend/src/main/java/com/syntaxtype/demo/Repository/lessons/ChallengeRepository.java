package com.syntaxtype.demo.Repository.lessons;


import com.syntaxtype.demo.Entity.Enums.ChallengeType;
import com.syntaxtype.demo.Entity.Lessons.Challenge;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChallengeRepository extends JpaRepository<Challenge, Long> {
    List<Challenge> findByType(ChallengeType type); // Custom query method
    Optional<Challenge> findBychallengeIdAndType(Long challengeId, ChallengeType type);
}