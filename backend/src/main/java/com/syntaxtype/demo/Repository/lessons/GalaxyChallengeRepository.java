package com.syntaxtype.demo.Repository.lessons;

import com.syntaxtype.demo.Entity.Lessons.GalaxyChallenge;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GalaxyChallengeRepository extends JpaRepository<GalaxyChallenge, Long> {
    boolean existsByTitle(String title);
}
