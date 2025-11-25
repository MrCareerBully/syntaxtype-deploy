package com.syntaxtype.demo.Repository.statistics;

import com.syntaxtype.demo.Entity.Statistics.Leaderboard;
import com.syntaxtype.demo.Entity.Users.User;
import com.syntaxtype.demo.Entity.Enums.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface LeaderboardRepository extends JpaRepository<Leaderboard, Long> {
    Optional<Leaderboard> findByUser(User user);
    List<Leaderboard> findByWordsPerMinute(Integer wordsPerMinute);
    List<Leaderboard> findByAccuracy(Integer accuracy);
    List<Leaderboard> findByTotalWordsTyped(Integer totalWordsTyped);
    List<Leaderboard> findByTotalTimeSpent(Integer totalTimeSpent);
    List<Leaderboard> findByCategory(Category category);
}
